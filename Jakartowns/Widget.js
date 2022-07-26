define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidget',
    'dojo/on',
    'dojo/Deferred',
    'dojo/_base/lang',
    'esri/geometry/webMercatorUtils',
    'esri/tasks/ProjectParameters',
    'esri/SpatialReference',
    'esri/request',
    'esri/layers/GraphicsLayer',
    'jimu/dijit/DrawBox',
  ],
  function(declare, 
    _WidgetsInTemplateMixin, 
    BaseWidget, 
    on, 
    Deferred, 
    lang, 
    webMercatorUtils,
    EsriProjectParameters,
    EsriSpatialReference,
    EsriRequest,
    GraphicsLayer, 
    ) {
        
    return declare([BaseWidget, _WidgetsInTemplateMixin], {
      name: 'Jakartowns',
      baseClass: 'jimu-widget-draw',
      _gs: null,
      _pointLayer: null,

      postCreate: function() {
        this.inherited(arguments);
        this._initGraphicsLayers();
        this.drawBox.setMap(this.map);
        this.drawBox.activate('POINT')
        this._bindEvents();
      },

      _initGraphicsLayers: function(){
        this._pointLayer = new GraphicsLayer();
        this.map.addLayer(this._pointLayer);
      },

      _bindEvents: function() {
        //bind DrawBox
        this.own(on(this.drawBox, 'DrawEnd', lang.hitch(this, this._onDrawEnd)));
      },

      _onDrawEnd: async function(graphic){
        this.drawBox.clear();
        var geometry = graphic.geometry;
        let mapPoint = await this.getDDPoint(geometry)
        let url = `https://maps.jakarto.com/?lat=${mapPoint.y}&lng=${mapPoint.x}`
        window.open(url)
      },

      getDDPoint: function (fromPoint) {
        var def = new Deferred();
        var webMerc = new EsriSpatialReference(3857);
        if (webMercatorUtils.canProject(fromPoint, webMerc)) {
          // if the point is in geographics or can be projected to geographics do so
          def.resolve(webMercatorUtils.webMercatorToGeographic(webMercatorUtils.project(fromPoint, webMerc)));
        } else {
          // if the point is NOT geographics and can NOT be projected to geographics
          // Find the most appropriate geo transformation and project the point to geographic
          var args = {
            url: this._gs.url + '/findTransformations',
            content: {
              f: 'json',
              inSR: fromPoint.spatialReference.wkid,
              outSR: 4326,
              extentOfInterest: JSON.stringify(this.map.extent)
            },
            handleAs: 'json',
            callbackParamName: 'callback'
          };
          new EsriRequest(args, {
              usePost: false
            }).then(lang.hitch(this, function (response) {
              var transformations = response && response.transformations ?
                response.transformations : undefined;
              var wkid = transformations && transformations.length > 0 ?
                transformations[0].wkid : undefined;
              var pp = new EsriProjectParameters();
              pp.outSR = new EsriSpatialReference(4326);
              pp.geometries = [fromPoint];
              pp.transformForward = true;
              pp.transformation = wkid;
              this._gs.project(pp, lang.hitch(this, function (r) {
                def.resolve(r[0]);
              }), function (err) {
                def.reject(err);
              });
            }), lang.hitch(this, function (err) {
            def.reject(err);
          }));
        }
        return def;
      },

      destroy: function() {
        if(this.drawBox){
          this.drawBox.destroy();
          this.drawBox = null;
        }
        if(this._pointLayer){
          this.map.removeLayer(this._pointLayer);
          this._pointLayer = null;
        }
        this.inherited(arguments);
      },
    });
  });
