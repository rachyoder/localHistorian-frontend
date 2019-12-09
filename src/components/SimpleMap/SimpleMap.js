import React from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import API_Calls from "../../utilities/Axios";
import { MobileView, isIOS } from "react-device-detect";
import Upload from "../Upload/Upload";
import "./SimpleMap.css";

export class SimpleMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            data: [],

        }
        this.MarkerGetter = this.MarkerGetter.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    /* Toggles the marker display, pulling information to be used by specific marker on info window */
    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }

    /* Resets Marker info back to default and hides the info window */
    onClose = props => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: {}
            });
        }
    };

    /* Closes the InfoWindow when you click on the map, only if it is currently open */
    closeInfoWindow() {
        if (this.state.showingInfoWindow) {
            this.setState({ showingInfoWindow: false });
        }
    }

    /* Gets all the markers currently available */
    async MarkerGetter() {
        await API_Calls.__get('/markers', '')
            .then(res => {
                this.setState({ data: res.data.data });
            });
    }

    componentDidMount() {
        this.MarkerGetter();
    }

    render() {
        const Markers = this.state.data.map((marker, idx) => {
            return (marker.isVerified) ? (
                <Marker
                    key={idx}
                    onClick={this.onMarkerClick}
                    position={{ lat: marker.lat, lng: marker.lon }}
                    name={marker.title}
                    title={marker.filename}
                />
            ) : (
                    null
                );
        })
        return (
            <React.Fragment>
                <Map
                    google={this.props.google}
                    zoom={14}
                    onClick={this.closeInfoWindow}
                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                    defaultOptions={{
                        maxZoom: 8,
                    }}
                    initialCenter={{
                        lat: 38.042081,
                        lng: -84.492542
                    }}
                    disableDefaultUI
                >
                    {this.state.data.length > 0 ? Markers : null}
                    {this.state.activeMarker ?
                        <InfoWindow
                            marker={this.state.activeMarker}
                            visible={this.state.showingInfoWindow}
                            onClose={this.onClose}
                        >
                            <div>
                                {isIOS ? (
                                    <img
                                        src={this.state.activeMarker.title}
                                        className="imgIOS"
                                        alt={this.state.activeMarker.name} 
                                    />
                                ) : (
                                <img
                                    src={this.state.activeMarker.title}
                                    className="mapImg"
                                    alt={this.state.activeMarker.name}
                                />
                                )}
                            </div>
                        </InfoWindow>
                        : null}
                </Map>
                <MobileView>
                    <footer
                        className="fixed-bottom"
                    >
                        <Upload
                            token={this.state.token}
                            setAlertStatus={this.props.setAlertStatus}
                        />
                    </footer>
                </MobileView>
            </React.Fragment>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC5Xu9GUoqhCX8nRYfXaqkA1saAs-hXH4k"
})(SimpleMap);
