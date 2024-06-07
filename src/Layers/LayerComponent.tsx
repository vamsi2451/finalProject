import React from "react";
import street from "../Images/street.png";
import map from "../Images/map.png";
import satellite from "../Images/satellite.png";
import "../Layers/LayerComponent.css";

interface LayerComponentProps {
  onChange: (style: string) => void;
  currentStyle: string;
}

const LayerComponent: React.FC<LayerComponentProps> = ({
  onChange,
  currentStyle,
}) => {
  return (
    <div>
      <img
        className={`image ${
          currentStyle ===
          "https://api.maptiler.com/maps/basic-v2/style.json?key=vazXV1hChkGLzIwyHVwj"
            ? "active"
            : ""
        }`}
        src={map}
        alt="Basic View"
        onClick={() =>
          onChange(
            "https://api.maptiler.com/maps/basic-v2/style.json?key=vazXV1hChkGLzIwyHVwj"
          )
        }
      />
      <img
        className={`image ${
          currentStyle ===
          "https://api.maptiler.com/maps/streets-v2/style.json?key=vazXV1hChkGLzIwyHVwj"
            ? "active"
            : ""
        }`}
        src={street}
        alt="Streets View"
        onClick={() =>
          onChange(
            "https://api.maptiler.com/maps/streets-v2/style.json?key=vazXV1hChkGLzIwyHVwj"
          )
        }
      />
      <img
        className={`image ${
          currentStyle ===
          "https://api.maptiler.com/maps/satellite/style.json?key=vazXV1hChkGLzIwyHVwj"
            ? "active"
            : ""
        }`}
        src={satellite}
        alt="Satellite View"
        onClick={() =>
          onChange(
            "https://api.maptiler.com/maps/satellite/style.json?key=vazXV1hChkGLzIwyHVwj"
          )
        }
      />
    </div>
  );
};

export default LayerComponent;
