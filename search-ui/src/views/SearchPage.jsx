import React from 'react';
import { CategorySearch, SingleDropdownList, SingleList, ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import axios from 'axios';
import { Dropdown, Menu, Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import { ReactiveOpenStreetMap } from '@appbaseio/reactivemaps';

const settings = require('../settings.json');
var config = require('../reportdefinition_version_1.json');



class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            current_config: undefined,
            selected_search: 'title',
            configuration_versions: []
        }

    }
    /*state: MyState = {
      
      selected_search: 'title',
      configuration_version: [{ key: 1, text: "Version 1", value: 1 }, { key: 2, text: "Version 2", value: 2 }]
    };*/


    getAuthHeader() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        let config = {
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        }
        return config;
    }

    async getConfig(version) {
        let url;
        if (version) {
            url = this.getURL().serviceurl_reporting + "reportdefinition?versionNumber=" + version;
        }
        else url = this.getURL().serviceurl_reporting + "reportdefinition";

        axios.get(url, this.getAuthHeader())
            .then((response) => {
                this.setState({
                    current_config: response.data.reportDefinition,
                    loading: false
                });
            }
            ).catch(response => {
                const responseString = response + "";
                if (responseString.includes("code 401")) {
                    localStorage.removeItem("currentUser");
                }
                console.log(response);
            })
    }

    getConfigTemp() {
        this.setState({
            current_config: config
        })
    }

    async getVersions() {
        await axios.get(this.getURL().serviceurl_reporting + "reportdefinitionversions", this.getAuthHeader()).then(version => {
            const list = []
            version.data.forEach(version_number => {
                list.push({ key: list.length, text: "Version " + version_number, value: version_number });
            })
            this.setState({ configuration_version: list });
        }).catch(response => {
            const responseString = response + "";
            if (responseString.includes("code 401")) {
                localStorage.removeItem("currentUser");
            }
            console.log(response);
        })

    }

    getURL() {
        return {
            serviceurl_reporting: 'http://localhost:8003/reporting/api/latest/',
            settings: this.getFunctionSettings()
        }
    }

    getFunctionSettings() {
        const hostname = window.location.hostname;
        const host = hostname.substr(0, hostname.indexOf('.'));

        // return the first setting where hostnames include host
        const setting = settings.find((s) => s.hostnames.indexOf(host) > -1);
        if (setting) {
            return setting;
        }

        // default to first settings entry
        return settings[0];
    }

    async componentWillMount() {
        await this.getVersions();
        await this.getConfig();
        //this.getVersions();
    }

    generateFilters() {
        var standardFields = [];
        var customfields = [];
        var geofield;

        if (this.state.loading === true) {
            return (
                <Segment style={{
                    minHeight: '100vh',
                    minWidth: '100vw'
                }}>
                    <Dimmer active>
                        <Loader size='massive'>Loading</Loader>
                    </Dimmer>
                </Segment>
            )
        }

        this.state.current_config.reportFields.forEach((element) => {
            if (element.inputRule.type === "LinkedList" && element.name !== undefined) {
                standardFields.push({ value: element.name, name: element.displayName });
            }
            if (element.inputRule.type === "SimpleList" && (Array.isArray(element.inputRule.value) && element.inputRule.value.length)) {
                customfields.push({ value: element.name, name: element.displayName });
            }
            if (element.inputRule.type === "Geometry" && element.name !== undefined) {
                geofield = { value: element.name, name: element.displayName }
            }
        });


        return (
            <ReactiveBase
                app="report"
                url="http://localhost:9200">

                <div style={{
                    display: 'flex', flexDirection: 'row'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh', width: '35%', marginLeft: '0.5%', marginRight: '2px', overflowY: 'scroll' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                            <SingleDropdownList
                                key="report_types"
                                style={{
                                    padding: '5px',
                                    marginTop: '10px',
                                    width: '70%'
                                }}
                                componentId="report_types"
                                dataField="report_type"
                                title="Datatype"
                                showCount={true}
                                placeholder="Search report types"
                                selectAllLabel="All Types"
                                loader="Loading ..."
                            />
                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px', marginTop: '35px' }}>
                                <Menu compact style={{ height: '30%' }}>
                                    <Dropdown text='Configuration' options={this.state.configuration_version} simple item />
                                </Menu>
                            </div>
                            {/** add version number here! */}
                        </div>
                        <CategorySearch
                            componentId="searchbox"
                            dataField="title"
                            placeholder="Search for reports"
                            style={{
                                padding: '5px',
                                marginTop: '10px',
                            }}
                        />
                        {standardFields.map(element =>
                            <SingleDropdownList
                                key={element.value}
                                style={{
                                    padding: '5px',
                                    marginTop: '10px',
                                }}
                                componentId={element.value}
                                dataField={element.value}
                                title={element.name}
                                showCount={true}
                                placeholder={"Søg efter " + element.name}
                                selectAllLabel={"Alle "}
                                loader="Loading ..." />
                        )}
                        <ReactiveList
                            componentId="SearchResult"
                            react={{
                                and:  ['searchbox' + {["a","b"]}],
                            }}
                            renderItem={res => <div>{res.title}</div>}
                        />

                        {/*customfields.map(element =>
          <CategorySearch
            key={element.value}
            style={{
              padding: '5px',
              marginTop: '10px',
            }}
            componentId={element.value}
            dataField={"dynamic_fields." + element.value + ".keyword"}
            title={element.name}
            placeholder={"Search for " + element.name}
            loader="Loading ..." />
        )*/}


                    </div>

                    <ReactiveOpenStreetMap
                        componentId="MapUI"
                        dataField="" />
                </div>
            </ReactiveBase >
        );
    }

    render() {

        return (
            <div>

                {this.generateFilters()}

            </div>
        );
    }
}

export default SearchPage;
