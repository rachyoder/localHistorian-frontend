import React from "react";
import EXIF from "exif-js";

export default class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styling: '',
            orientation: 0
        }
        this.getOrientationExif = this.getOrientationExif.bind(this);
    }

    getOrientationExif() {
        let img = document.createElement("img");
        img.setAttribute('src', this.props.imgSrc);
        // let img = document.getElementById("get-exif");

        if (img != null) {
            EXIF.getData(img, () => {
                let orientation = EXIF.getTag(this, "Orientation");
                console.log('o', orientation);
                this.setState({ orientation: orientation });
            });
        }
        else {
            this.getOrientationExif();
            console.log("in else");
        }
        console.log('image:', this.props.imgSrc);
        // this.forceUpdate();
        this.setState({ state: this.state });
    }

    componentDidMount() {

    }

    render() {
        // setTimeout(this.getOrientationExif, 1000)
        const _this = this;
        function imageRenderer() {
            // _this.getOrientationExif()
            return (
                _this.props.imgSrc ?
                    _this.state.orientation ?
                        <img
                            src={_this.props.imgSrc}
                            className={_this.props.className}
                            id="get-exif"
                            alt={_this.props.alt}
                            onLoad={_this.getOrientationExif}
                        />
                        : null
                    : null
            );
        }
        return imageRenderer();
    }
}