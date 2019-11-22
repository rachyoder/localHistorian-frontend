import React from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class SimpleMap extends React.Component {
    static defaultProps = {
        center: {
            lat: 38.041936,
            lng: -84.492732
        },
        zoom: 14
    };

    render() {


        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    options={{fullscreenControl: false}}
                    bootstrapURLKeys={{ key: 'AIzaSyC5Xu9GUoqhCX8nRYfXaqkA1saAs-hXH4k' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                    <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>
        );
    }
}