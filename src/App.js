import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "xml-js/dist/xml-js.js";
import JSZip from "jszip/dist/jszip.js";
import "./App.css";
import erdf from "./img/erdf.svg";
import northumbria from "./img/northumbria.svg";
import ryder from "./img/ryder.svg";
import React, { Component } from "react";
class App extends Component {
  state = {
    recordFields: [
      "sourceName",
      "sourceVersion",
      "device",
      "type",
      "unit",
      "creationDate",
      "startDate",
      "endDate",
      "value",
    ],
    status: (
      <span>
        <strong>No File Loaded.</strong> Drag a file into the box below to begin
      </span>
    ),
    alertLevel: "secondary",
    fileContents: "",
    records: [],
    categories: [],
  };

  handleOnDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
  };

  handleOnDrop = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
    this.readBlob(files[0]);
    this.setState({
      status: (
        <span>
          Parsing data from <strong>{files[0].name}</strong>.
        </span>
      ),
    });
    this.setState({ alertLevel: "info" });
  };

  handleOnCheck = (evt, id) => {
    const categories = this.state.categories.map((c) => {
      if (c.name === id) c.checked = evt.target.checked;
      return c;
    });
    this.setState({ categories });
  };

  handleDownloadClick = () => {
    this.createZipFile();
  };

  saveData = (blob, filename) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display:none");
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  arrayToCsv(array) {
    let csvContent = this.state.recordFields.join(",") + "\r\n";
    csvContent += array
      .map((e) => {
        let csv =
          this.state.recordFields
            .map((r) => {
              return e[r];
            })
            .join(",") + "\r\n";
        // console.log(csv);
        // csv = csv.substr(0, csv.length - 1) + "\r\n";
        return csv;
      })
      .join("\n");
    return csvContent;
  }

  createZipFile = () => {
    let categories = this.state.categories.filter((c) => c.checked);
    if (categories.length === 0) {
      this.setState({
        status:
          "No categories selected. Please select a cateogory before clicking download",
      });
      this.setState({
        alertLevel: "danger",
      });
      return;
    }

    let zip = new JSZip();
    let date = new Date();
    let d = date.toDateString();
    let t = date.toLocaleTimeString().replace(/:/gm, "_");
    categories.map((c) => {
      zip.file(
        `${c.name}_${d}-${t}.csv`,
        this.arrayToCsv(this.state.records[c.name])
      );
      return c;
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
      this.saveData(content, `health_data_${d}-${t}.zip`);
    });
  };

  readBlob = (file) => {
    let start = 0;
    let stop = file.size - 1;
    let reader = new FileReader();
    reader.onloadend = (evt) => {
      if (evt.target.readyState === FileReader.DONE) {
        this.setState({ fileContents: evt.target.result });
        var convert = require("xml-js");
        let result = convert.xml2json(evt.target.result, {
          compact: true,
          spaces: 4,
        });
        const records = this.state.records;
        const categories = this.state.categories;
        JSON.parse(result).HealthData.Record.map((r) => {
          const regex = /HK.*TypeIdentifier/i;
          let key = r._attributes.type.replace(regex, "");
          if (!(key in this.state.records)) {
            records[key] = [];
            categories.push({ name: key, checked: false });
          }
          records[key].push(r._attributes);
          return r;
        });
        this.setState({ records: records });
        this.setState({ categories });
        this.setState({
          healthData: JSON.parse(result).HealthData.Record,
        });
        this.setState({ status: <strong>Parsing data complete.</strong> });
        this.setState({ alertLevel: "success" });
      }
    };
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
  };

  render() {
    return (
      <div className="App">
        <header>
          <div className="jumbotron">
            <div className="container">
              <div className="row mt-5">
                <div className="col">
                  <h1 className="display-4">iOS Health Data Parser</h1>
                  <p className="lead">
                    This is application parses the XML data exported from iOS
                    Health app and creates CSV files for the chosen health
                    categories.
                  </p>
                  <hr className="my-4" />
                  <p>
                    This application was developed to support research funded by
                    Northumbria University and the European Regional Development
                    Fund’s Intensive Industrial Innovation Programme as part of
                    doctoral PhD programme. The sponsoring Small to Medium
                    Enterprise for this programme was Ryder Architecture and it
                    was delivered through Northumbria University.
                  </p>
                  <div className="container">
                    <div className="row my-4">
                      <div className="col-4">
                        <a
                          target="_blank"
                          href="https://ec.europa.eu/regional_policy/en/funding/erdf/"
                          rel="noreferrer noopener"
                        >
                          <img
                            src={erdf}
                            alt="European Regional Development Fund logo"
                          />
                        </a>
                      </div>
                      <div className="col-4">
                        <a
                          target="_blank"
                          href="https://www.northumbria.ac.uk/"
                          rel="noreferrer noopener"
                        >
                          <img
                            src={northumbria}
                            alt="Northumbria University Logo"
                          />
                        </a>
                      </div>
                      <div className="col-4">
                        <a
                          target="_blank"
                          href="https://ryderarchitecture.com"
                          rel="noreferrer noopener"
                        >
                          <img src={ryder} alt="Ryder Architecture Logo" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4" />
                  <h5>Data Privacy Statement</h5>
                  <p>
                    This app works client-side (processed by your browser) and
                    no data is collected, stored or managed by this application.
                    When the Save File(s) button is clicked a file is generated
                    locally in your browser and will automatically download to
                    your machine as a compressed archive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="row">
            <div className="col">
              <p
                className={`alert alert-${this.state.alertLevel}`}
                id="file_name"
              >
                {this.state.status}
              </p>
              <div
                id="drop_zone"
                onDragOver={(e) => this.handleOnDragOver(e)}
                onDrop={(e) => this.handleOnDrop(e)}
              >
                <p>DROP iOS Health export.xml FILE&nbsp;HERE</p>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              <div className="alert alert-warning" role="alert">
                After the file has been parsed, a list of health categories will
                be generated below. From this list, select the categories you
                wish export then press the export button
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-8">
              <ul id="category">
                {this.state.categories.map((c) => (
                  <React.Fragment key={`${c.name}_fragment`}>
                    <li key={c.name}>
                      <div
                        key={`${c.name}_switch`}
                        className="form-check form-switch"
                      >
                        <input
                          key={`${c.name}_input`}
                          className="form-check-input"
                          type="checkbox"
                          id={`${c.name}_flexSwitchCheckDefault`}
                          checked={c.checked}
                          onChange={(e) => this.handleOnCheck(e, c.name)}
                        />
                        <label
                          key={`${c.name}_label+`}
                          className="form-check-label"
                          htmlFor={`${c.name}_flexSwitchCheckDefault`}
                        >
                          {c.name}
                        </label>
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </div>
            <div className="col-4">
              {this.state.categories.length > 0 ? (
                <div key="download_btn" className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    type="button"
                    onClick={() => this.handleDownloadClick()}
                  >
                    <i className="fa fa-download"></i>&nbsp;Save File(s)
                  </button>
                </div>
              ) : (
                React.Fragment
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
