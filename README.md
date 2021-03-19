# iOS Health Data Parser

This is application parses the XML data exported from iOS Health app and creates CSV files for the chosen health categories.

This application was developed to support research funded by Northumbria University and the European Regional Development Fund’s Intensive Industrial Innovation Programme as part of doctoral PhD programme. The sponsoring Small to Medium Enterprise for this programme was Ryder Architecture and it was delivered through Northumbria University.



[![European Regional Development Fund logo](https://raw.githubusercontent.com/gcoulby/apple-health-data-parser/master/src/img/erdf.svg)](https://ec.europa.eu/regional_policy/en/funding/erdf/)			[![Northumbria University Logo](https://raw.githubusercontent.com/gcoulby/apple-health-data-parser/master/src/img/northumbria.svg)](https://www.northumbria.ac.uk/)			[![Ryder Architecture Logo](https://raw.githubusercontent.com/gcoulby/apple-health-data-parser/master/src/img/ryder.svg)](https://ryderarchitecture.com/)



## Usage

This application is available for use without installation via GitHub pages. This application can be found here:

https://gcoulby.github.io/apple-health-data-parser/

### Instructions

This application parses the `export.xml` file obtained from iOS health app. To obtain the `export.xml` follow the instructions provided by Apple:

https://support.apple.com/en-gb/guide/iphone/iph27f6325b2/ios

> **The `export.xml` file will contain personal information that can be used to identify the user of the application. It will also contain all data captured by the application. This application will remove the personal data and allow you to control which data is exported, so you can share the sanitised data instead**

Once you have obtained your `export.xml` file, simply drag it into the box inside  app. Once the file has finished parsing, a list of health data categories will appear at the bottom of the screen. By default the toggle switches for each box are disabled. Click the health data categories you wish to export then press the `Save File(s)` button. This will create a compressed zip archive that contains a separate Comma Separated Value (CSV) file for each category of health data. 



## Installation

To install this application run the following command to clone the repository and change the active directory to the newly cloned repo.

```bash
$ git clone https://github.com/gcoulby/apple-health-data-parser.git
$ cd apple-health-data-parser
```



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
