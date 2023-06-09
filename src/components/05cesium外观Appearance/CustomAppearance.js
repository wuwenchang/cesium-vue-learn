import Cesium from 'cesium/Cesium'

class CustomAppearance {
  constructor(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
    var translucent = Cesium.defaultValue(options.translucent, true);
    var closed = false;
    var vertexFormat = CustomAppearance.VERTEX_FORMAT;

    var defaultVertexShaderSource =options.vertexShaderSource;
    var defaultFragmentShaderSource = options.fragmentShaderSource;

    this.material = Cesium.defined(options.material) ? options.material : Cesium.Material.fromType(Cesium.Material.ColorType);

    this.translucent = translucent;

    this._vertexShaderSource = Cesium.defaultValue(options.vertexShaderSource, defaultVertexShaderSource);
    this._fragmentShaderSource = Cesium.defaultValue(options.fragmentShaderSource, defaultFragmentShaderSource);
    this._renderState = Cesium.Appearance.getDefaultRenderState(translucent, closed, options.renderState);
    this._closed = closed;


    this._vertexFormat = vertexFormat;
  }
}


Object.defineProperties(CustomAppearance.prototype, {

  vertexShaderSource : {
    get : function() {
      var vs = this._vertexShaderSource;
      if (this.material.shaderSource.search(/varying\s+float\s+v_polylineAngle;/g) !== -1) {
        vs = '#define POLYLINE_DASH\n' + vs;
      }
      return vs;
    }
  },

  fragmentShaderSource : {
    get : function() {
      return this._fragmentShaderSource;
    }
  },

  renderState : {
    get : function() {
      return this._renderState;
    }
  },


  closed : {
    get : function() {
      return this._closed;
    }
  },

  vertexFormat : {
    get : function() {
      return this._vertexFormat;
    }
  }
});


CustomAppearance.VERTEX_FORMAT = Cesium.VertexFormat.POSITION_AND_ST;

CustomAppearance.prototype.getFragmentShaderSource = Cesium.Appearance.prototype.getFragmentShaderSource;

CustomAppearance.prototype.isTranslucent = Cesium.Appearance.prototype.isTranslucent;

CustomAppearance.prototype.getRenderState = Cesium.Appearance.prototype.getRenderState;


export default CustomAppearance;

