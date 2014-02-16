
/**
 * @author Jason Parrott
 * @preserve
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {
  var AlphabetJS = global.AlphabetJS = {
    createProgram: createProgram,
    createLoader: createLoader,
    programs: {},
    loaders: {}
  };

  function createProgram(pType, pFunctionMap) {
    var tClass = AlphabetJS.programs[pType];
    if (tClass !== void 0) {
      return new tClass(pFunctionMap);
    }
    return null;
  }

  function createLoader(pType) {
    var tClass = AlphabetJS.loaders[pType];
    if (tClass !== void 0) {
      return new tClass();
    }
    return null;
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;

  AlphabetJS.Loader = Loader;

  function Loader() {

  }

  Loader.prototype.load = function(pProgram, pData, pMetadata) {
    // Implement this.
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var AlphabetJS = global.AlphabetJS;

  /**
   * @class
   * @extends {AlphabetJS.Loader}
   */
  var ASLoader = (function(pSuper) {
    function ASLoader() {
      pSuper.call(this);
    }

    ASLoader.prototype = Object.create(pSuper.prototype);

    return ASLoader;
  })(AlphabetJS.Loader);

  AlphabetJS.loaders.AS1VM = ASLoader;
  AlphabetJS.loaders.AS2VM = ASLoader;

  function ASData(pActions, pVersion) {
    this.actions = pActions;
    this.version = pVersion;
  }

  ASLoader.prototype.load = function(pProgram, pActions, pMetadata) {
    return pProgram.load(new ASData(pActions, pMetadata.version));

  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;

  AlphabetJS.Program = Program;

  function Program(pFunctionMap) {
    //this.functionMap = pFunctionMap;

    setupFunctionMap(this, pFunctionMap);

    this.loadedData = [];
    this.literalTables = [];
    this.startTime = Date.now();
  }

  Program.prototype.load = function(pData) {
    var tId = this.loadedData.length;

    this.loadedData[tId] = pData;
    this.literalTables[tId] = [];

    return tId;
  };

  /*Program.prototype.callMapped = function(pName) {
    var tMapped = this.functionMap[pName];

    if (typeof tMapped !== 'function') {
      return;
    };

    return tMapped.apply(this, Array.prototype.slice.call(arguments, 1));
  };*/

  Program.prototype.run = function(pId) {
    // implement this
  };

  function setupFunctionMap(pProgram, pFunctionMap) {
    for (var k in pFunctionMap) {
      pProgram[k] = pFunctionMap[k];
    }
  }

}(this));

/**
 * @fileoverview This file holds the definition of the theatre namespace.
 * @author Jason Parrott
 * @license TheatreScript
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license.
 * See the LICENSE file in the original source for details.
 */

var theatre = {
  crews: {}
};

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {
  var theatre = global.theatre;

  /**
   * The namespace for SWFCrew.
   * @type {object}
   */
  var swfcrew = theatre.crews.swf = {
    handlers: {},
    utils: {},
    ASHandlers: {},
    props: {},
    actors: {},
    actions: {},
    actionsMap: {},
    structs: {},
    render: {} // :( The naming was for nouns... render isn't a noun...
  };

  /**
   * Plays a SWF file that will be loaded with the given Loader
   * in the given container.
   * @param  {theatre.crews.swf.Loader} pLoader The Loader to load in.
   * @param  {object} pData     The data to load via the Loader.
   * @param  {Node} pAttachTo The HTML Node to appendChild to.
   * @param  {object} pOptions  Options to customize play.
   * @return {theatre.crews.swf.Player} The Player that can play the SWF file.
   */
  function play(pLoader, pData, pAttachTo, pOptions) {
    pLoader.load(pData, pOptions);

    var tPlayer = new swfcrew.Player(pLoader);

    pLoader.on('loadcomplete', function() {
      tPlayer.takeCentreStage(pAttachTo);
    });

    return tPlayer;
  }

  /**
   * Plays the SWF file at the given URL.
   * @param  {string} pURL      The URL
   * @param  {Node} pAttachTo The HTML Node to appendChild to.
   * @param  {object} pOptions  Options to customize play.
   * @return {theatre.crews.swf.Player} The Player that can play the SWF file.
   */
  swfcrew.playURL = function(pURL, pAttachTo, pOptions) {
    return play(new swfcrew.URLLoader(), pURL, pAttachTo, pOptions);
  };

  /**
   * Plays the given byte array as a SWF.
   * @param  {Uint8Array} pData The data to play.
   * @param  {Node} pAttachTo The HTML Node to appendChild to.
   * @param  {object} pOptions  Options to customize play.
   * @return {theatre.crews.swf.Player} The Player that can play the SWF file.
   */
  swfcrew.playData = function(pData, pAttachTo, pOptions) {
    return play(new swfcrew.DataLoader(), pData, pAttachTo, pOptions);
  };

  /**
   * Plays the given QuickSWF SWF file.
   * @param  {quickswf.SWF} pSWF The SWF file to play.
   * @param  {Node} pAttachTo The HTML Node to appendChild to.
   * @param  {object} pOptions  Options to customize play.
   * @return {theatre.crews.swf.Player} The Player that can play the SWF file.
   */
  swfcrew.playSWF = function(pSWF, pAttachTo, pOptions) {
    return play(new swfcrew.Loader(), pSWF, pAttachTo, pOptions);
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  theatre.crews.swf.structs.ColorTransform = ColorTransform;

  function ColorTransform() {
    this.multipliers = 0xFFFFFFFF >>> 0;
    this.addends = 0 >>> 0;
    this.flags = 0 >>> 0;

    this.isIdentity = true;
    this.isAlmostIdentity = true;

    this.redMult = 1;
    this.greenMult = 1;
    this.blueMult = 1;
    this.alphaMult = 1;
    this.redAdd = 0;
    this.greenAdd = 0;
    this.blueAdd = 0;
    this.alphaAdd = 0;

    this.equals = equals;
    this.transform = transform;
    this.clone = clone;
    this.update = update;
  }

  function equals(pColorTransform) {
    return (
      this.multipliers === pColorTransform.multipliers &&
      this.addends === pColorTransform.addends &&
      this.flags === pColorTransform.flags
    );
  }

  function transform(pColorTransform) {
    this.redAdd += (pColorTransform.redAdd * this.redMult) | 0;
    this.greenAdd += (pColorTransform.greenAdd * this.greenMult) | 0;
    this.blueAdd += (pColorTransform.blueAdd * this.blueMult) | 0;
    this.alphaAdd += (pColorTransform.alphaAdd * this.alphaMult) | 0;
    this.redMult *= pColorTransform.redMult;
    this.greenMult *= pColorTransform.greenMult;
    this.blueMult *= pColorTransform.blueMult;
    this.alphaMult *= pColorTransform.alphaMult;

    this.update();
  }

  function clone() {
    var tColorTransform = new ColorTransform();

    tColorTransform.multipliers = this.multipliers;
    tColorTransform.addends = this.addends;
    tColorTransform.flags = this.flags;

    tColorTransform.isAlmostIdentity = this.isAlmostIdentity;
    tColorTransform.isIdentity = this.isIdentity;

    tColorTransform.redMult = this.redMult;
    tColorTransform.greenMult = this.greenMult;
    tColorTransform.blueMult = this.blueMult;
    tColorTransform.alphaMult = this.alphaMult;
    tColorTransform.redAdd = this.redAdd;
    tColorTransform.greenAdd = this.greenAdd;
    tColorTransform.blueAdd = this.blueAdd;
    tColorTransform.alphaAdd = this.alphaAdd;

    return tColorTransform;
  }

  function update() {
    var tRedMulti = this.redMult;
    var tGreenMulti = this.greenMult;
    var tBlueMulti = this.blueMult;
    var tAlphaMulti = this.alphaMult;
    var tRedAdd = this.redAdd;
    var tGreenAdd = this.greenAdd;
    var tBlueAdd = this.blueAdd;
    var tAlphaAdd = this.alphaAdd;

    // Yes, we are loosing 1 value of precision here.
    // Doing it for simpleness.
    var tMultipliers = this.multipliers =
      ((Math.abs(tRedMulti * 255) << 24) |
      (Math.abs(tGreenMulti * 255) << 16) |
      (Math.abs(tBlueMulti * 255) << 8) |
      Math.abs(tAlphaMulti * 255)) >>> 0;

    var tAddends = this.addends =
      ((Math.abs(tRedAdd) << 24) |
      (Math.abs(tGreenAdd) << 16) |
      (Math.abs(tBlueAdd) << 8) |
      Math.abs(tAlphaAdd)) >>> 0;

    // TODO: See if there is a faster way to do this.
    var tFlags = this.flags = 
      (((tRedMulti < 0 ? 1 : 0) << 7) |
      ((tGreenMulti < 0 ? 1 : 0) << 6) |
      ((tBlueMulti < 0 ? 1 : 0) << 5) |
      ((tAlphaMulti < 0 ? 1 : 0) << 4) |
      ((tRedAdd < 0 ? 1 : 0) << 3) |
      ((tGreenAdd < 0 ? 1 : 0) << 2) |
      ((tBlueAdd < 0 ? 1 : 0) << 1) |
      (tAlphaAdd < 0 ? 1 : 0)) >>> 0;

    var tIsAlmostIdentity = this.isAlmostIdentity =
      tFlags === 0 &&
      ((tMultipliers & (0xFFFFFF00 >>> 0)) >>> 0) === (0xFFFFFF00 >>> 0) && 
      tAddends === 0;

    this.isIdentity = tIsAlmostIdentity && tAlphaMulti === 1;
  }

  ColorTransform.fromValues = function(
      pRedMulti, pGreenMulti, pBlueMulti, pAlphaMulti,
      pRedAdd, pGreenAdd, pBlueAdd, pAlphaAdd
    ) {
    var tColorTransform = new ColorTransform();

    tColorTransform.redMult = pRedMulti;
    tColorTransform.greenMult = pGreenMulti;
    tColorTransform.blueMult = pBlueMulti;
    tColorTransform.alphaMult = pAlphaMulti;
    tColorTransform.redAdd = pRedAdd;
    tColorTransform.greenAdd = pGreenAdd;
    tColorTransform.blueAdd = pBlueAdd;
    tColorTransform.alphaAdd = pAlphaAdd;

    tColorTransform.update();

    return tColorTransform;
  }

  ColorTransform.fromQuickSWF = function(pColorTransform) {
    return ColorTransform.fromValues(
      pColorTransform.rm / 256,
      pColorTransform.gm / 256,
      pColorTransform.bm / 256,
      pColorTransform.am / 256,
      pColorTransform.ra,
      pColorTransform.ga,
      pColorTransform.ba,
      pColorTransform.aa
    );
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  theatre.crews.swf.render.renderPropOnMorphShapePreRender = onMorphShapePreRender;

  function onMorphShapePreRender(pPackage, pTarget) {
    var tActor = pTarget.actor;
    var tRatio = tActor.ratio;

    if (pTarget.lastRatio !== tRatio) {
      //pTarget.updateHash(tActor);
      pTarget.lastRatio = tRatio;
    }
  }

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var swfcrew = theatre.crews.swf;
  var mASHandlers = swfcrew.ASHandlers;

  swfcrew.Player = Player;

  var mPlayerIds = 0;

  /**
   * A class that can play SWF files.
   * @param {theatre.crews.swf.Loader} pLoader The Loader that loaded the SWF file.
   * @param {theatre.Stage=} pStage The Stage to play this SWF file in.
   */
  function Player(pLoader, pStage) {
    this.id = ++mPlayerIds;

    var tStage = pStage || new theatre.Stage();

    /**
     * The Stage the SWF file is playing in.
     * @type {theatre.Stage}
     */
    this.stage = tStage;

    /**
     * The Loader that loaded the SWF file.
     * @type {theatre.crews.swf.Loader}
     */
    this.loader = pLoader;

    /**
     * The container holding this Player.
     * @type {Object}
     */
    this.container = null;

    /**
     * The compositor that sets up the rendering system
     * and manages various rendering effects such as
     * masks.
     * @type {theatre.crews.swf.render.Compositor}
     */
    this.compositor = null;

    this.renderManagerProp = null;

    var tSelf = this;

    /**
     * A reference to the current root Sprite.
     * @type {theatre.crews.swf.actors.SpriteActor}
     */
    this.root = null;

    /**
     * A reference to all media loaded in QuickSWF.
     * @type {quickswf.utils.MediaLoader}
     */
    this.media = pLoader.assetManfiest;

    /**
     * The ActionScript Loader that is used to load ActionScript bytecode.
     * @type {AlphabetJS.Loader}
     */
    this.actionScriptLoader = pLoader.actionScriptLoader;

    /**
     * The ActionScript Program that all ActionScript code will run in.
     * @type {AlphabetJS.Program}
     */
    this.actionScriptProgram = pLoader.actionScriptProgram;

    /**
     * Counter used to count the number of Sprite instances.
     * Used to create the correct name for the Sprite.
     * @type {number}
     */
    this.spriteInstanceCounter = 0;

    /**
     * Counter used to count the number of non-Sprite instances.
     * Used to create a meaningful name for non-Sprite objects.
     * @type {number}
     */
    this.notSpriteInstanceCounter = 0;

    var tOptions = pLoader.options;

    if ('spriteCache' in tOptions) {
      this.spriteCache = tOptions.spriteCache;
    } else {
      this.spriteCache = true;
    }

    if ('cacheInvalidationRatio' in tOptions) {
      this.cacheInvalidationRatio = tOptions.cacheInvalidationRatio;
    } else {
      this.cacheInvalidationRatio = 0.5;
    }

    if ('complexShapeNumOfVerticies' in tOptions) {
      this.complexShapeNumOfVerticies = tOptions.complexShapeNumOfVerticies;
    } else {
      this.complexShapeNumOfVerticies = 30;
    }

    if ('canvasSizeBug' in tOptions) {
      benri.env.setVar('benri.impl.web.graphics.canvasSizeBug', tOptions.canvasSizeBug);
    }

    /**
     * The actual width of the player.
     * @private
     * @type {number}
     */
    this._width = 'width' in tOptions ? tOptions.width : 0;

    /**
     * The actual height of the player.
     * @private
     * @type {number}
     */
    this._height = 'height' in tOptions ? tOptions.height : 0;

    /**
     * The scale mode of the Player.
     * Possible values are:
     * * fit
     * ** Scale to the current size of player with the
     * ** original aspect ratio.
     * * none
     * ** Do not scale. Use original size of SWF file
     * ** regardless of the Player size.
     * @private
     * @type {string}
     */
    this._scaleMode = 'scaleMode' in tOptions ? tOptions.scaleMode : 'none';

    /**
     * The id attribute of Surface(canvas, etc.) element.
     * @private
     * @type {string}
     */
    this.name = 'name' in tOptions ? tOptions.name : null;

  }

  /**
   * Tells this Player to completely take control over it's Stage.
   * Usually you want to use this to play a SWF file.
   * @param  {Node} pAttachTo The container to attach to.
   */
  Player.prototype.takeCentreStage = function(pAttachTo) {
    var tStage = this.stage;
    var tLoader = this.loader;
    var tOptions = tLoader.options;

    this.container = pAttachTo;

    // Set up the step rate to match the SWF file frame rate.
    tStage.stepRate = 1000 / tLoader.swf.frameRate;

    this.setSize(this._width, this._height);

    // Create a new Compositor.
    var tCompositor = this.compositor = this.newCompositor();
    
    this.media = this.loader.media;

    var tRenderManagerProp = this.renderManagerProp = new theatre.crews.render.RenderManagerProp(tCompositor.camera);

    if ('syncRendering' in tOptions) {
      tRenderManagerProp.syncRendering = tOptions.syncRendering;
    }

    tRenderManagerProp.on('render', createOnRender(this));

    tStage.props.add(tRenderManagerProp);

    tStage.props.add(new theatre.crews.audio.AudioManagerProp());

    if ('cacheRetryCooldown' in tOptions) {
      tRenderManagerProp.cacheManager.cooldownMax = (tOptions.cacheRetryCooldown * tLoader.swf.frameRate) | 0;
    }

    if ('cacheUsageCounterMax' in tOptions) {
      tRenderManagerProp.cacheManager.usageCounterMax = (tOptions.cacheUsageCounterMax * tLoader.swf.frameRate) | 0;
    }

    // TODO: This is depending on the DOM... should fix it later...
    var tSurface = tCompositor.getSurface();
    tSurface.style.width = ((this._width / global.devicePixelRatio) | 0) + 'px';
    tSurface.style.height = ((this._height / global.devicePixelRatio) | 0) + 'px';
    pAttachTo.appendChild(tSurface);

    if (this.name) {
      tSurface.setAttribute('id', this.name);
    }

    if (!tSurface.hasAttribute('tabindex')) {
      // Need to allow this to receive keyboard events.
      tSurface.setAttribute('tabindex', '0');
    }

    // Create the root Sprite.
    var tRoot = this.root = this.newRoot();

    tStage.on('prepare', function(pData, pTarget) {
      // Add the root Sprite to the stage.
      pTarget.addActor(tRoot);
    }, 1);

    this.play();
  };

  function createOnRender(pPlayer) {
    return function(pData, pTarget) {
      pPlayer.compositor.onRender();
    }
  }

  Player.prototype.setScaleMode = function(pMode) {
    this._scaleMode = pMode;

    if (this.container !== null) {
      this.setSize(0, 0);
    }
  };

  Player.prototype.getScaleMode = function() {
    return this._scaleMode;
  };

  Player.prototype.setSize = function(pWidth, pHeight) {
    if (!pWidth && !pHeight) {
      // Auto. Use the container or original swf size
      if (this._scaleMode === 'fit') {
        // Scale to fit the container.
        pWidth = this.loader.swf.width;
        pHeight = this.loader.swf.height;

        var tWidthRatio = this.container.offsetWidth / pWidth
        var tHeightRatio = this.container.offsetHeight / pHeight;

        if (tWidthRatio < tHeightRatio) {
          pWidth *= tWidthRatio;
          pHeight *= tWidthRatio;
        } else {
          pWidth *= tHeightRatio;
          pHeight *= tHeightRatio;
        }
      } else {
        pWidth = this.loader.swf.width;
        pHeight = this.loader.swf.height;
      }
    } else if (!pWidth) {
      // Keep aspect ratio. Use given height.
      pWidth = pHeight * (this.loader.swf.width / this.loader.swf.height);
    } else if (!pHeight) {
      // Keep aspect ratio. Use given width.
      pHeight = pWidth / (this.loader.swf.width / this.loader.swf.height);
    }

    pWidth = (pWidth * global.devicePixelRatio) | 0;
    pHeight = (pHeight * global.devicePixelRatio) | 0;

    this._width = pWidth;
    this._height = pHeight;

    if (this.compositor !== null) {
      var tOldSurface = this.compositor.getSurface();
      this.compositor.setSize(pWidth, pHeight, global.devicePixelRatio);
      var tSurface = this.compositor.getSurface();
      tSurface.style.width = ((pWidth / global.devicePixelRatio) | 0) + 'px';
      tSurface.style.height = ((pHeight / global.devicePixelRatio) | 0) + 'px';

      if (tSurface !== tOldSurface) {
        tOldSurface.parentNode.removeChild(tOldSurface);

        var tStage = this.stage;

        if (tStage.isOpen) {
          theatre.crews.dom.disableKeyInput(tStage, tOldSurface);
          theatre.crews.dom.disablePointerInput(tStage, tOldSurface);

          theatre.crews.dom.enableKeyInput(tStage, tSurface);
          theatre.crews.dom.enablePointerInput(tStage, tSurface);
        }

        this.container.appendChild(tSurface);

        if (!tSurface.hasAttribute('tabindex')) {
          // Need to allow this to receive keyboard events.
          tSurface.setAttribute('tabindex', '0');
        }
      }
    }
  };

  Player.prototype.getSize = function() {
    return {
      width: this._width,
      height: this._height
    };
  };

  Player.prototype.getName = function() {
    return this.name;
  };


  // This get's rid of the outline ring for focused elements.
  function onContainerFocus(pEvent) {
    pEvent.target.style.outline = 'none';
  }

  /**
   * Play the current SWF file.
   */
  Player.prototype.play = function() {
    if (this.compositor === null) {
      return;
    }
    
    var tStage = this.stage;
    var tSurface = this.compositor.getSurface();

    // TODO: Should we make this overridable?
    tSurface.addEventListener('focus', onContainerFocus, false);

    theatre.crews.dom.enableKeyInput(tStage, tSurface);
    theatre.crews.dom.enablePointerInput(tStage, tSurface);

    // Start playing.
    tStage.open();
  };

  /**
   * Pauses the current SWF file.
   */
  Player.prototype.pause = function() {
    if (this.compositor === null) {
      return;
    }

    var tStage = this.stage;
    var tSurface = this.compositor.getSurface();

    tSurface.removeEventListener('focus', onContainerFocus, false);

    tStage.close();

    theatre.crews.dom.disableKeyInput(tStage, tSurface);
    theatre.crews.dom.disablePointerInput(tStage, tSurface);
  };

  /**
   * Creates a new Compositor for this Player.
   * @return {theatre.crews.swf.render.Compositor}
   */
  Player.prototype.newCompositor = function() {
    return new swfcrew.render.Compositor(this, global.devicePixelRatio);
  };

  /**
   * Creates a new root Sprite for this Player.
   * @return {theatre.crews.swf.actors.SpriteActor}
   */
  Player.prototype.newRoot = function() {
    var tLoader = this.loader;
    var tRoot = this.newFromId(0);
    tRoot.player = this;
    tRoot.__isRoot = true;

    var tVars = tLoader.options.rootVars, tValue;

    // Merging the data into the sprite.
    if (tVars) {
      for (var k in tVars) {
        tValue = tVars[k];
        if (tValue instanceof global.Array) {
          tRoot.setVariable(k, tValue[0]);
        } else {
          tRoot.setVariable(k, tValue);
        }
      }
    }

    return tRoot;
  };

  /**
   * Instantiates a new DisplayList object from
   * the given ID.
   * @param  {number} pId The ID DisplayList ID of the object.
   * @return {theatre.crews.swf.actors.DisplayListActor}
   */
  Player.prototype.newFromId = function(pId) {
    var tActorData = this.loader.actorMap[pId];

    if (tActorData === void 0) {
      return null;
    }
    
    var tActorDataArgs = tActorData.args;

    var tArgs = {
      displayListId: pId
    };

    for (k in tActorDataArgs) {
      tArgs[k] = tActorDataArgs[k];
    }

    return new tActorData.clazz(tArgs);
  };

  /**
   * Instantiates a new DisplayList object from
   * the given name. This name must have been
   * exported via ExportAssets
   * @param  {string} pName The name of the object.
   * @return {theatre.crews.swf.actors.DisplayListActor}
   */
  Player.prototype.newFromName = function(pName) {
    var tActorData = this.loader.actorNameMap[pName];

    if (tActorData === void 0) {
      return null;
    }
    
    var tActorDataArgs = tActorData.args;

    var tArgs = {
      displayListId: tActorData.id
    };

    for (k in tActorDataArgs) {
      tArgs[k] = tActorDataArgs[k];
    }

    return new tActorData.clazz(tArgs);
  };

  /**
   * I/F for setting the touch->key event mappings.
   * Each entry must have the format like the following example:
   *  {
   *    rect : [0, 0, 35, 35], // Array<Number>[4] - Coordinates in pixel(x, y, width, height)
   *    key: {
   *      code:   13,    // Number  - Unicode for the key
   *      alt:    false, // boolean - [option] Whether the Alt key was held down
   *      shift:  false, // boolean - [option] Whether the Shift key was held down
   *      ctrl:   false, // boolean - [option] Whether the Ctrl key was held down
   *      meta:   false, // boolean - [option] Whether the Meta key was held down
   *      repeat: false  // boolern - [option] Whether the key was held down long enought to begin repeating
   *    }
   *  }
   * @param  {Array} pKeyMap Array containing the mapping table.
   */
  Player.prototype.setKeyMap = function(pKeyMap) {
    var tStage = this.stage;
    tStage.keyMap = generateKeyMap(pKeyMap);
    tStage.on('hittest', onHitTest);
  };

  Player.prototype.clearKeyMap = function(pKeyMap) {
    var tStage = this.stage;
    tStage.keyMap = null;
    tStage.ignore('hittest', onHitTest);
  };

  function generateKeyMap(pData) {

    var tKeyMap = [], tEntry, tRect, tKey,
        tRawEntry, tRawRect, tRawKey;

    for (var i = 0, il = pData.length; i < il; i++) {
      tRawEntry = pData[i];
      tRawRect = tRawEntry.rect;
      tRawKey = tRawEntry.key;
      tRect = global.benri.geometry.Rect.obtain(
        tRawRect[0] / global.devicePixelRatio,
        tRawRect[1] / global.devicePixelRatio,
        tRawRect[2] / global.devicePixelRatio,
        tRawRect[3] / global.devicePixelRatio);
      tKey = {
          code:   tRawKey.code,
          alt:    tRawKey.alt    || false,
          shift:  tRawKey.shift  || false,
          ctrl:   tRawKey.ctrl   || false,
          meta:   tRawKey.meta   || false,
          repeat: tRawKey.repeat || false
      };
      tEntry = {
        rect: tRect.getPolygon(),
        key: tKey
      };
      tKeyMap.push(tEntry);
      tRect.recycle();
    }
    return tKeyMap;
  }

  function onHitTest(pData, pTarget) {
    var tKeyMap = pTarget.keyMap,
        tEntry, tRect, tKey;

    for (var i = 0, il = tKeyMap.length; i < il; i++) {
      tEntry = tKeyMap[i];
      tRect = tEntry.rect;
      tKey = tEntry.key;

      if (tRect.isPointInside(pData.x, pData.y)) {
        pTarget.keyManager.down(
          tKey.code,
          tKey.alt,
          tKey.shift,
          tKey.ctrl,
          tKey.meta,
          tKey.repeat
        );
      }
    }
  }

  Player.prototype.getVariable = Player.prototype.GetVariable = function (pName) {
    var tData = mASHandlers.getVariableData(pName, this.root);

    if (tData === null) {
      return null;
    }

    var tValue = tData.target.getVariable(tData.name);

    return tValue || null;
  };

  Player.prototype.setVariable = Player.prototype.SetVariable = function (pName, pValue) {
    var tData = mASHandlers.getVariableData(pName, this.root);

    if (tData === null) {
      return;
    }

    tData.target.setVariable(tData.name, pValue === void 0 ? null : pValue);
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

theatre.crews.audio = {};

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

theatre.crews.render = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

theatre.crews.bounds = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var theatre = global.theatre;
  var document = global.document;

  theatre.crews.dom = theatre.crews.dom || {};

  theatre.crews.dom.enableKeyInput = enableKeyInput;
  theatre.crews.dom.disableKeyInput = disableKeyInput;
  theatre.crews.dom.enablePointerInput = enablePointerInput;
  theatre.crews.dom.disablePointerInput = disablePointerInput;

  var mKeyStages = [];
  var mKeyTargets = [];

  var mPointerStages = [];
  var mPointerTargets = [];

  function onKeyDown(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mKeyTargets.slice(0);
    var tStages = mKeyStages.slice(0);

    for (var i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        tStages[i].keyManager.down(
          pEvent.keyCode,
          pEvent.altKey,
          pEvent.shiftKey,
          pEvent.ctrlKey,
          pEvent.metaKey,
          pEvent.repeat
        );
      }
    }
  }

  function onKeyUp(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mKeyTargets.slice(0);
    var tStages = mKeyStages.slice(0);

    for (var i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        tStages[i].keyManager.up(
          pEvent.keyCode,
          pEvent.altKey,
          pEvent.shiftKey,
          pEvent.ctrlKey,
          pEvent.metaKey
        );
      }
    }
  }

  function onTouchStart(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mPointerTargets.slice(0);
    var tStages = mPointerStages.slice(0);
    var tTouches = pEvent.changedTouches;
    var tTouch;
    var i, il, j, jl;
    var tBounds = tTarget.getBoundingClientRect();
    var tY = tBounds.top;
    var tX = tBounds.left;

    for (i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        for (j = 0, jl = tTouches.length; j < jl; j++) {
          tTouch = tTouches[j];
          tStages[i].pointerManager.down(
            tTouch.identifier, // The ID of this pointer
            tTouch.clientX - tX, // Relative X
            tTouch.clientY - tY, // Relative Y
            tTouch === pEvent.touches[0] // isPrimary
          );
        }
      }
    }
  }

  function onTouchMove(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mPointerTargets.slice(0);
    var tStages = mPointerStages.slice(0);
    var tTouches = pEvent.changedTouches;
    var tTouch;
    var i, il, j, jl;
    var tBounds = tTarget.getBoundingClientRect();
    var tY = tBounds.top;
    var tX = tBounds.left;

    for (i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        for (j = 0, jl = tTouches.length; j < jl; j++) {
          tTouch = tTouches[j];
          tStages[i].pointerManager.move(
            tTouch.identifier, // The ID of this pointer
            tTouch.clientX - tX, // Relative X
            tTouch.clientY - tY, // Relative Y
            tTouch === pEvent.touches[0] // isPrimary
          );
        }
      }
    }
  }

  function onTouchEnd(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mPointerTargets.slice(0);
    var tStages = mPointerStages.slice(0);
    var tTouches = pEvent.changedTouches;
    var tTouch;
    var i, il, j, jl;
    var tBounds = tTarget.getBoundingClientRect();
    var tY = tBounds.top;
    var tX = tBounds.left;

    for (i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        for (j = 0, jl = tTouches.length; j < jl; j++) {
          tTouch = tTouches[j];
          tStages[i].pointerManager.up(
            tTouch.identifier, // The ID of this pointer
            tTouch.clientX - tX, // Relative X
            tTouch.clientY - tY, // Relative Y
            tTouch === pEvent.touches[0] // isPrimary
          );
        }
      }
    }
  }

  function onMouseDown(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mPointerTargets.slice(0);
    var tStages = mPointerStages.slice(0);
    var i, il;
    var tBounds = tTarget.getBoundingClientRect();
    var tY = tBounds.top;
    var tX = tBounds.left;

    for (i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        tStages[i].pointerManager.down(
          1, // The ID of this pointer
          pEvent.clientX - tX, // Relative X
          pEvent.clientY - tY, // Relative Y
          true // isPrimary
        );
      }
    }
  }

  function onMouseMove(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mPointerTargets.slice(0);
    var tStages = mPointerStages.slice(0);
    var i, il;
    var tBounds = tTarget.getBoundingClientRect();
    var tY = tBounds.top;
    var tX = tBounds.left;

    for (i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        tStages[i].pointerManager.move(
          1, // The ID of this pointer
          pEvent.clientX - tX, // Relative X
          pEvent.clientY - tY, // Relative Y
          true // isPrimary
        );
      }
    }
  }

  function onMouseUp(pEvent) {
    var tTarget = pEvent.currentTarget;
    var tTargets = mPointerTargets.slice(0);
    var tStages = mPointerStages.slice(0);
    var i, il;
    var tBounds = tTarget.getBoundingClientRect();
    var tY = tBounds.top;
    var tX = tBounds.left;

    for (i = 0, il = tTargets.length; i < il; i++) {
      if (tTargets[i] === tTarget) {
        tStages[i].pointerManager.up(
          1, // The ID of this pointer
          pEvent.clientX - tX, // Relative X
          pEvent.clientY - tY, // Relative Y
          true // isPrimary
        );
      }
    }
  }

  function listenerIndex(pStages, pTargets, pStage, pTarget) {
    for (var i = 0, il = pStages.length; i < il; i++) {
      if (pStages[i] === pStage && pTargets[i] === pTarget) {
        return i;
      }
    }

    pStages.push(pStage);
    pTargets.push(pTarget);

    return -1;
  }

  function enableKeyInput(pStage, pContainer) {
    if (listenerIndex(mKeyStages, mKeyTargets, pStage, pContainer) !== -1) {
      return;
    }

    pContainer.addEventListener('keydown', onKeyDown, false);
    pContainer.addEventListener('keyup', onKeyUp, false);
  }

  function disableKeyInput(pStage, pContainer) {
    var tIndex = listenerIndex(mKeyStages, mKeyTargets, pStage, pContainer);

    if (tIndex !== -1) {
      mKeyStages.splice(tIndex, 1);
      mKeyTargets.splice(tIndex, 1);

      pContainer.removeEventListener('keydown', onKeyDown, false);
      pContainer.removeEventListener('keyup', onKeyUp, false);
    }
  }

  function enablePointerInput(pStage, pContainer) {
    if (listenerIndex(mPointerStages, mPointerTargets, pStage, pContainer) !== -1) {
      return;
    }

    if (global.navigator.pointerEnabled) {
      // for the PointerEvent spec

    } else if ('ontouchstart' in document.documentElement) {
      // for touch event browsers
      pContainer.addEventListener('touchstart', onTouchStart, false);
      pContainer.addEventListener('touchmove', onTouchMove, false);
      pContainer.addEventListener('touchend', onTouchEnd, false);
    } else {
      // fallback to mouse
      pContainer.addEventListener('mousedown', onMouseDown, false);
      pContainer.addEventListener('mousemove', onMouseMove, false);
      pContainer.addEventListener('mouseup', onMouseUp, false);
    }
  }

  function disablePointerInput(pStage, pContainer) {
    var tIndex = listenerIndex(mPointerStages, mPointerTargets, pStage, pContainer);

    if (tIndex !== -1) {
      mPointerStages.splice(tIndex, 1);
      mPointerTargets.splice(tIndex, 1);

      if (global.navigator.pointerEnabled) {
        // for the PointerEvent spec

      } else if ('ontouchstart' in document.documentElement) {
        // for touch event browsers
        pContainer.removeEventListener('touchstart', onTouchStart, false);
        pContainer.removeEventListener('touchmove', onTouchMove, false);
        pContainer.removeEventListener('touchend', onTouchEnd, false);
      } else {
        // fallback to mouse
        pContainer.removeEventListener('mousedown', onMouseDown, false);
        pContainer.removeEventListener('mousemove', onMouseMove, false);
        pContainer.removeEventListener('mouseup', onMouseUp, false);
      }
    }
  }

}(this));
/**
 * @author Guangyao LIU
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.theatre.TraversalNode = TraversalNode;

  /**
   * A traversal list data structure based on Actors' parent-child relationship.
   * Actors that have the same layer (for sorting) will be rejected on insert.
   * @constructor
   * @param {theatre.Actor} pActor The actor to store in this node.
   */
  function TraversalNode(pActor) {
    /** @type {theatre.Actor} */
    this.actor = pActor;

    this.prev = this;

    this.next = this;

    this.prevSibling = null;
    
    this.nextSibling = null;

    this.hasChild = false;
  }

  TraversalNode.prototype.appendChild = function(pChildNode) {
    var tNextNode, tAncestorNode, tUpperNode;
    var tTailNode = pChildNode.prev;
    var tPrevSiblingNode, tNextSiblingNode;

    if (this.hasChild) { // parent has child
      tNextSiblingNode = this.next;

      while (tNextSiblingNode && tNextSiblingNode.actor.layer < pChildNode.actor.layer) { // Search for next sibling
        tPrevSiblingNode = tNextSiblingNode;
        tNextSiblingNode = tNextSiblingNode.nextSibling;
      }

      if (tPrevSiblingNode) {
        tPrevSiblingNode.nextSibling = pChildNode;
        pChildNode.prevSibling = tPrevSiblingNode;
      }

      if (tNextSiblingNode) { // pChildNode would not be the last child
        pChildNode.nextSibling = tNextSiblingNode;
        tNextSiblingNode.prevSibling = pChildNode;

        tNextNode = tNextSiblingNode;
      } else { // pChildNode would be the last child
        tUpperNode = this;
        tNextNode = tUpperNode.nextSibling;

        while (!tNextNode) { // Search for next sibling on upper level
          tAncestorNode = tUpperNode.getParentNode();

          if (!tAncestorNode) {
            tNextNode = tUpperNode;
            break;
          }

          tUpperNode = tAncestorNode;
          tNextNode = tUpperNode.nextSibling;
        }
      }
    } else { // parent has no child
      tNextNode = this.next;
      this.hasChild = true;
    }
    
    pChildNode.prev = tNextNode.prev;
    tTailNode.next = tNextNode;
    pChildNode.prev.next = pChildNode;
    tTailNode.next.prev = tTailNode;

    return true;
  };


  TraversalNode.prototype.leave = function() {
    var tTailNode;
    var tParentNode = this.getParentNode();

    if (this.nextSibling) {
      this.nextSibling.prevSibling = this.prevSibling;
    }
    if (this.prevSibling) {
      this.prevSibling.nextSibling = this.nextSibling;
    }
    if (!this.prevSibling && !this.nextSibling) {
      tParentNode.hasChild = false;
    }

    tTailNode = this.getTailNode();

    this.prev.next = tTailNode.next;
    tTailNode.next.prev = this.prev;
    this.prev = tTailNode;
    tTailNode.next = this;

    this.prevSibling = null;
    this.nextSibling = null;
  };


  TraversalNode.prototype.getTailNode = function() {
    var tNextNode, tUpperNode, tAncestorNode;

    if (!this.hasChild) {
      return this;
    }

    tUpperNode = this;
    tNextNode = tUpperNode.nextSibling;

    while (!tNextNode) { // Search for next sibling on upper level
      tAncestorNode = tUpperNode.getParentNode();

      if (!tAncestorNode) {
        tNextNode = tUpperNode;
        break;
      }

      tUpperNode = tAncestorNode;
      tNextNode = tUpperNode.nextSibling;
    }

    return tNextNode.prev;
    
  };

  TraversalNode.prototype.getParentNode = function() {
    var tParentActor = this.actor.parent;

    if (tParentActor) {
      return tParentActor.node;
    }

    return null;
  };

  TraversalNode.prototype.processBottomUpLastToFirst = function(pCallback, pData) {
    var tCurrentNode = this.getTailNode();
    
    while (tCurrentNode !== this) {
      pCallback(tCurrentNode, pData);

      if (pCallback.onLeave) {
        pCallback.onLeave(tCurrentNode, pData);
      }

      tCurrentNode = tCurrentNode.prev;
    }

    pCallback(tCurrentNode, pData);

    if (pCallback.onLeave) {
      pCallback.onLeave(tCurrentNode, pData);
    }
  };


  TraversalNode.prototype.processTopDownFirstToLast = function(pCallback, pData) {
    var tCurrentNode = this;
    var tNextNode, tOnLeaveNode;
    var tLeaveNodeStack = new Array();
    var tIsAborted = false;
    var tHasChild;

    while (true) {
      tNextNode = tCurrentNode.next;
      tHasChild = tCurrentNode.hasChild;
      tIsAborted = false;

      if (pCallback(tCurrentNode, pData) === false) {
        tIsAborted = true;
        tNextNode = tCurrentNode.nextSibling;

        if (!tNextNode) {
          tNextNode = tCurrentNode.getTailNode().next;
        }
      }
      
      tLeaveNodeStack.push(tCurrentNode);

      if (!tHasChild || tIsAborted) {
        do {
          tOnLeaveNode = tLeaveNodeStack.pop();

          if (pCallback.onLeave) {
            pCallback.onLeave(tOnLeaveNode, pData);
          }

          if (tLeaveNodeStack.length === 0) {
            return;
          }
        } while(!tOnLeaveNode.nextSibling);
      }

      tCurrentNode = tNextNode;
    }
  };

  TraversalNode.prototype.constructor = TraversalNode;

})(this);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  theatre.SceneInstance = SceneInstance;

  function SceneInstance(pScene) {
    this.scene = pScene;
    this.actors = [];

    this.reset = reset;
    this.step = step;
    this.setStep = setStep;

    this.reset();
  }

  function reset() {
    this.actors.length = 0;
    this.previous = -1;
    this.looped = false;
    this.current = 0;
    this.target = 0;
  }

  function step(pDelta) {
    var tPreviousStep = this.previous = this.current;
    var tCurrentStep = this.current = this.target += pDelta;

    if (tCurrentStep >= this.scene.getLength()) {
      this.current = this.target = 0;
      this.previous = -1;
      this.looped = true;
    } else {
      this.looped = false;
    }
  }

  function setStep(pStep) {
    if (pStep < 0 || pStep >= this.scene.getLength()) {
      return false;
    }

    this.previous = pStep - 1;
    this.looped = false;
    this.current = this.target = pStep;

    return true;
  }

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var SceneInstance = theatre.SceneInstance;

  theatre.Scene = Scene;

  function Scene() {
    this._preparedScripts = [];
    this._scripts = [];
    this._labels = {};
    this._length = 0;
    this._idCounter = -1;
    this.actorInfo = [];

    this.setLength = setLength;
    this.getLength = getLength;
    this.setLabel = setLabel;
    this.removeLabel = removeLabel;
    this.getLabel = getLabel;
    this.addPreparedScript = addPreparedScript;
    this.addScript = addScript;
    this.removePreparedScript = removePreparedScript;
    this.removeScript = removeScript;
    this.getNumOfPreparedScripts = getNumOfPreparedScripts;
    this.getNumOfScripts = getNumOfScripts;
    this.doPreparedScript = doPreparedScript;
    this.doPreparedScripts = doPreparedScripts;
    this.doScripts = doScripts;
    this.getNextActorId = getNextActorId;

    this.edit = edit;
    this.createInstance = createInstance;
  }

  function onReadd(pData, pTarget) {
    var tPosition = pTarget.position;
    var tDataPosition = pData.position;

    if (tDataPosition) {
      if (!tPosition.equalsVector(tDataPosition)) {
        tPosition.set(pData.position);
        pTarget.invalidate();
      }
    } else if (!tPosition.isIdentity()) {
      tPosition.reset();
      pTarget.invalidate();
    }
  }

  var PREPARE_ADD = Scene.PREPARE_ADD = 0;
  var PREPARE_MOVE = Scene.PREPARE_MOVE = 1;
  var PREPARE_MOVETO = Scene.PREPARE_MOVETO = 2;
  var PREPARE_REMOVE = Scene.PREPARE_REMOVE = 3;
  var PREPARE_CALLBACK = Scene.PREPARE_CALLBACK = 4;

  var mPreparedScriptAddedCallbacks = [];
  var mPrepareCallbacks = [];

  Scene.registerPreparedCallback = function(pId, pCallback, pOnAdd) {
    mPrepareCallbacks[pId] = pCallback;
    pOnAdd && this.registerOnAddCallback(pId, pOnAdd);
  };

  Scene.unregisterPreparedCallback = function(pId) {
    mPrepareCallbacks[pId] = void 0;
    mPreparedScriptAddedCallbacks[pId] = void 0;
  };

  Scene.registerOnAddCallback = function(pId, pOnAdd) {
    var tOnAddList = mPreparedScriptAddedCallbacks[pId];

    if (tOnAddList) {
      tOnAddList.push(pOnAdd);
    } else {
      mPreparedScriptAddedCallbacks[pId] = [pOnAdd];
    }
  };

  Scene.unregisterOnAddCallback = function(pId, pOnAdd) {
    var tOnAddList = mPreparedScriptAddedCallbacks[pId], tIndex;

    if (tOnAddList && (tIndex = tOnAddList.indexOf(pOnAdd)) !== -1) {
      tOnAddList.splice(tIndex, 1);
      if (tOnAddList.length === 0) {
        mPreparedScriptAddedCallbacks[pId] = void 0;
      }
    }
  };

  Scene.registerPreparedCallback(
    PREPARE_ADD,
    function add(pActor, pData) {
      var tLayer = -1;
      var tNewActor;
      var tSceneInstance = pActor._sceneInstance;
      var tId = pData.id;
      var tUserData = pData.data;

      if (tSceneInstance.actors[tId] !== void 0) {
        tNewActor = tSceneInstance.actors[tId];

        if (tNewActor.invalidationInfo.isPrepareLocked === false) {
          tNewActor.emit('readd', tUserData);
        }

        return tNewActor;
      }

      var tLeaveStep = tSceneInstance.scene.actorInfo[tId].leave;

      if (tLeaveStep !== -1 && tSceneInstance.target >= tLeaveStep) {
        // Skip actors that are going to be
        // removed anyways when we finish stepping.
        return null;
      }

      if ('layer' in tUserData) {
        tLayer = tUserData.layer;
      }

      if (tUserData.args) {
        tNewActor = new pData.clazz(tUserData.args);
      } else {
        tNewActor = new pData.clazz();
      }

      tSceneInstance.actors[tId] = tNewActor;
      tNewActor.name = tUserData.name;

      if (tUserData.position) {
        tNewActor.position.set(tUserData.position);
      }

      tNewActor.invalidationInfo.isFromTimeline = true;
      tNewActor.invalidationInfo.sceneInfo = tSceneInstance.scene.actorInfo[tId];
      tNewActor.invalidationInfo.sceneActorId = tId;

      pActor.addActorAtLayer(tNewActor, tLayer);

      tNewActor.on('readd', onReadd);

      return tNewActor;
    },
    function onAddAdd(pScene, pStep, pData) {
      pScene.actorInfo[pData.id] = {
        enter: pStep,
        leave: -1,
        lastPosition: 'position' in pData.data ? pData.data.position : null
      };
    }
  );

  Scene.registerPreparedCallback(
    PREPARE_MOVE,
    function move(pActor, pData) {
      var tActor = pActor._sceneInstance.actors[pData.id];

      if (tActor !== void 0 && tActor.invalidationInfo.isPrepareLocked === false) {
        tActor.position.multiply(pData.position);
        tActor.invalidate();
      }
    }
  );

  Scene.registerPreparedCallback(
    PREPARE_MOVETO,
    function moveTo(pActor, pData) {
      var tActor = pActor._sceneInstance.actors[pData.id];

      if (tActor !== void 0 && tActor.invalidationInfo.isPrepareLocked === false) {
        tActor.position.set(pData.position);
        tActor.invalidate();
      }
    },
    function onMoveToAdd(pScene, pStep, pData) {
      pScene.actorInfo[pData.id].lastPosition = pData.position;
    }
  );

  Scene.registerPreparedCallback(
    PREPARE_REMOVE,
    function remove(pActor, pData) {
      var tActor = pActor._sceneInstance.actors[pData.id];

      if (tActor !== void 0) {
        pActor._sceneInstance.actors[pData.id] = void 0;
        tActor.leave();
        tActor.position.recycle();
      }
    },
    function onRemoveAdd(pScene, pStep, pData) {
      pScene.actorInfo[pData.id].leave = pStep;
    }
  );

  Scene.registerPreparedCallback(
    PREPARE_CALLBACK,
    function callback(pActor, pData) {
      pData.callback(pActor, pData.data);
    }
  );

  function setLength(pLength) {
    var tCurrentLength = this._length;
    var tScripts;
    var i;

    if (tCurrentLength === pLength) {
      return;
    } else if (tCurrentLength > pLength) {
      // Remove dangling steps.
      this._preparedScripts.splice(pLength - 1, tCurrentLength - pLength);
      this._scripts.splice(pLength - 1, tCurrentLength - pLength);
    } else {
      // Add new steps.
      tScripts = this._preparedScripts;

      for (i = tCurrentLength; i < pLength; i++) {
        tScripts[i] = [];
      }

      tScripts = this._scripts;

      for (i = tCurrentLength; i < pLength; i++) {
        tScripts[i] = [];
      }
    }

    this._length = pLength;
  }

  function getLength() {
    return this._length;
  }

  function setLabel(pName, pStep) {
    this._labels[pName] = pStep;
  }

  function removeLabel(pName) {
    delete this._labels[pName];
  }

  function getLabel(pName) {
    var tStep = this._labels[pName];

    if (tStep === void 0) {
      return -1;
    }

    return tStep;
  }  

  function addPreparedScript(pStep, pType, pData) {
    var tLength = this._length;
    var tScripts = this._preparedScripts;

    if (pStep >= tLength) {
      this.setLength(pStep + 1);
    }

    var tCallbacks = mPreparedScriptAddedCallbacks[pType];

    if (tCallbacks !== void 0) {
      for (var i = 0, il = tCallbacks.length; i < il; i++) {
        tCallbacks[i](this, pStep, pData);
      }
    }

    tScripts[pStep].push(pType, pData);
  }

  function addScript(pStep, pCallback) {
    var tLength = this._length;
    var tScripts = this._scripts;

    if (pStep >= tLength) {
      this.setLength(pStep + 1);
    }

    tScripts[pStep].push(pCallback);
  }

  function removePreparedScript(pStep, pIndex) {
    if (pStep >= this._length) {
      return;
    }

    this._preparedScripts[pStep].splice(pIndex, 1);
  }

  function removeScript(pStep, pIndex) {
    if (pStep >= this._length) {
      return;
    }

    this._scripts[pStep].splice(pIndex, 1);
  }

  function getNumOfPreparedScripts(pStep) {
    if (pStep >= this._length) {
      return 0;
    }

    return this._preparedScripts[pStep].length;
  }

  function getNumOfScripts(pStep) {
    if (pStep >= this._length) {
      return 0;
    }

    return this._scripts[pStep].length;
  }

  function doPreparedScript(pType, pActor, pData) {
    return mPrepareCallbacks[pType](pActor, pData);
  }

  function doPreparedScripts(pStep, pActor) {
    if (pStep < 0 || pStep >= this._length) {
      return;
    }

    var tScripts = this._preparedScripts[pStep];

    pActor.invalidationInfo.isPreparing = true;

    for (var i = 0, il = tScripts.length; i < il; i += 2) {
      mPrepareCallbacks[tScripts[i]](pActor, tScripts[i + 1]);
    }

    pActor.invalidationInfo.isPreparing = false;
  }

  function doScripts(pStep, pActor) {
    if (pStep < 0 || pStep >= this._length) {
      return;
    }

    var tScripts = this._scripts[pStep];

    for (var i = 0, il = tScripts.length; i < il; i++) {
      if (tScripts[i](pActor) === false) {
        tScripts.splice(i, 1);
        il--;
        i--;
      }
    }
  }

  function getNextActorId() {
    return ++this._idCounter;
  }

  function edit() {
    return new theatre.SceneEditor(this);
  }

  function createInstance() {
    return new SceneInstance(this);
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var swfcrew = theatre.crews.swf;
  var mActions = swfcrew.actions;

  swfcrew.actionsMap.replace = mActions.PREPARE_REPLACE = 0x101;
  swfcrew.actionsMap.colorTransform = mActions.PREPARE_COLORTRANSFORM = 0x102;
  swfcrew.actionsMap.clip = mActions.PREPARE_CLIP = 0x103;
  swfcrew.actionsMap.ratio = mActions.PREPARE_RATIO = 0x104;

  theatre.Scene.registerPreparedCallback(
    mActions.PREPARE_REPLACE,
    function replace(pActor, pData) {
      var tSceneInstance = pActor._sceneInstance;
      var tActor = tSceneInstance.actors[pData.oldId];
      var tPosition = pData.position ? pData.position : null;
      var tColorTransform = tSceneInstance.scene.actorInfo[pData.oldId].colorTransform;

      if (tActor !== void 0) {
        if (tPosition === null) {
          tPosition = tActor.position.getArray();
        }

        pActor._sceneInstance.actors[pData.oldId] = void 0;
        tActor.leave();
      } else {
        if (tPosition === null) {
          tPosition = tSceneInstance.scene.actorInfo[pData.oldId].lastPosition;
        }
      }

      pActor = tSceneInstance.scene.doPreparedScript(theatre.Scene.PREPARE_ADD, pActor, {
        clazz: pData.clazz,
        data: pData,
        id: pData.newId
      });

      if (pActor === null) {
        return;
      }

      if (tPosition !== null) {
        pActor.position.set(tPosition);
      }

      if (tColorTransform) {
        pActor.colorTransform = tColorTransform;
      }
    },
    function onReplaceAdd(pScene, pStep, pData) {
      pScene.actorInfo[pData.oldId].leave = pStep;
      pScene.actorInfo[pData.newId] = {
        enter: pStep,
        leave: -1,
        lastPosition: pData.position ? pData.position : pScene.actorInfo[pData.oldId].lastPosition,
        colorTransform: pScene.actorInfo[pData.oldId].colorTransform
      };
    }
  );

  theatre.Scene.registerPreparedCallback(
    mActions.PREPARE_COLORTRANSFORM,
    function ColorTransform(pActor, pData) {
      var tActor = pActor.getSceneInstance().actors[pData.id];

      if (tActor === void 0 || tActor.invalidationInfo.isPrepareLocked === true) {
        return;
      }

      tActor.colorTransform = pData.colorTransform;
      tActor.invalidate();
    },
    function onColorTransformAdd(pScene, pStep, pData) {
      pScene.actorInfo[pData.id].colorTransform = pData.colorTransform;
    }
  );

  theatre.Scene.registerPreparedCallback(
    mActions.PREPARE_CLIP,
    function Clip(pActor, pData) {
      var tActor = pActor.getSceneInstance().actors[pData.id];

      if (tActor === void 0) {
        return;
      }

      tActor.clipDepth = pData.clipDepth;
      tActor.invalidate();
    }
  );

  theatre.Scene.registerPreparedCallback(
    mActions.PREPARE_RATIO,
    function Ratio(pActor, pData) {
      var tActor = pActor.getSceneInstance().actors[pData.id];

      if (tActor === void 0) {
        return;
      }

      tActor.ratio = Math.round((pData.ratio / 0xFFFF) * 100) / 100;

      tActor.invalidate();
    }
  );

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Scene = theatre.Scene;
  var PREPARE_ADD = Scene.PREPARE_ADD;
  var PREPARE_MOVE = Scene.PREPARE_MOVE;
  var PREPARE_MOVETO = Scene.PREPARE_MOVETO;
  var PREPARE_REMOVE = Scene.PREPARE_REMOVE;
  var PREPARE_CALLBACK = Scene.PREPARE_CALLBACK;

  theatre.SceneEditor = SceneEditor;

  function SceneEditor(pScene) {
    this.scene = pScene;
    this.step = 0;

    this.add = add;
    this.move = move;
    this.moveTo = moveTo;
    this.remove = remove;
    this.prepare = prepare;
    this.prepareScript = prepareScript;
    this.script = script;
    this.step = step;
    this.stepTo = stepTo;
    this.label = label;
  }

  function add(pClass, pData) {
    var tScene = this.scene;
    var tId = tScene.getNextActorId();

    tScene.addPreparedScript(this.step, PREPARE_ADD, {
      clazz: pClass,
      data: pData,
      id: tId
    });

    return tId;
  }

  function move(pId, pPosition) {
    this.scene.addPreparedScript(this.step, PREPARE_MOVE, {
      id: pId,
      position: pPosition
    });
  }

  function moveTo(pId, pPosition) {
    this.scene.addPreparedScript(this.step, PREPARE_MOVETO, {
      id: pId,
      position: pPosition
    });
  }

  function remove(pId) {
    this.scene.addPreparedScript(this.step, PREPARE_REMOVE, {
      id: pId
    });
  }

  function prepare(pPreparedId, pData) {
    this.scene.addPreparedScript(this.step, pPreparedId, pData);
  }

  function prepareScript(pCallback, pData) {
    this.scene.addPreparedScript(this.step, PREPARE_CALLBACK, {
      callback: pCallback,
      data: pData
    });
  }

  function script(pCallback) {
    this.scene.addScript(this.step, pCallback);
  }

  function step(pSteps) {
    return this.stepTo(this.step + pSteps);
  }

  function stepTo(pStep) {
    var tScene = this.scene;

    if (pStep < 0) {
      this.step = 0;
    } else if (pStep >= tScene.getLength()) {
      tScene.setLength(pStep + 1);
    }

    this.step = pStep;

    return this;
  }

  function label(pLabel) {
    this.scene.setLabel(this.step, pLabel);
  }

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var theatre = global.theatre;

  theatre.Prop = Prop;

  /**
   * Actors can hold Props.
   * @constructor
   */
  function Prop() {
    this.id = -1;
    this.type = '';
    this.stage = null;
    this.actor = null;
  }

  var tProto = Prop.prototype;

  tProto.onEnter = function(pStage) {
    this.stage = pStage;
  };

  tProto.onLeave = function() {
    this.stage = null;
  };

  tProto.onAdd = function(pActor) {
    this.actor = pActor;
  };

  tProto.onRemove = function() {
    this.actor = null;
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var theatre = global.theatre;

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var MediaProp = (function(pSuper) {
    function MediaProp() {
      pSuper.call(this);
      this.playbackState = MediaProp.PLAYBACK_STATE_NOT_READY;
      this.callbacks = {endOfStream: []};
    }

    MediaProp.prototype = Object.create(pSuper.prototype);
    MediaProp.prototype.constructor = MediaProp;

    return MediaProp;
  })(theatre.Prop);

  theatre.MediaProp = MediaProp;

  MediaProp.prototype.type = 'Media';

  MediaProp.PLAYBACK_STATE_NOT_READY         = 'notReady';
  MediaProp.PLAYBACK_STATE_READY             = 'ready';
  MediaProp.PLAYBACK_STATE_PLAYING           = 'playing';
  MediaProp.PLAYBACK_STATE_PAUSED            = 'paused';

  /**
   * Overload this in your subclass to play back media data.
   */
  MediaProp.prototype.play = function() {
    // play back here.
  };

  /**
   * Overload this in your subclass to stop the playback.
   */
  MediaProp.prototype.stop = function() {
    // stop here.
  };

  /**
   * Overload this in your subclass to pause the playback.
   */
  MediaProp.prototype.pause = function() {
    // pause here.
  };

  /**
   * Overload this in your subclass to jump to a specific point in the playback.
   * @param {Number} pPoint Specific point in the playback.
   */
  MediaProp.prototype.seek = function(pPoint) {
    // seek here.
  };

  /**
   * Registers an event handler to Prop.
   * @param {string} pName The type of event.
   * @param {function} pCallback The callback.
   * @return {theatre.Actor} This Prop.
   */
  MediaProp.prototype.on = function(pName, pCallback) {
    if (this.callbacks[pName] === void 0) {
      this.callbacks[pName] = [pCallback];
    } else {
      this.callbacks[pName].push(pCallback);
    }
    return this;
  };

  /**
   * Removes an event handler from Prop.
   * @param {string} pName The type of event.
   * @param {function} pCallback The callback.
   * @return {theatre.Actor} This Prop.
   */
  MediaProp.prototype.off = function(pName, pCallback) {
    if (pName in this.callbacks) {
      var tCallbacks = this.callbacks[pName];
      for (var i = 0, il = tCallbacks; i < il; i++) {
        if (tCallbacks[i] === pCallback) {
          tCallbacks.splice(i, 1);
          break;
        }
      }
      if (tCallbacks.length === 0) {
        delete this.callbacks[pName];
      }
    }
    return this;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var theatre = global.theatre;

  theatre.InputManager = InputManager;

  /**
  * A class for dispatching input cues (events)
  * @constructor
  */
  function InputManager(pStage) {
    this.stage = pStage;
  }

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.InputManager}
   */
  var PointerManager = (function(pSuper) {
    /**
     * @constructor
     */
    function PointerManager(pStage) {
      pSuper.call(this, pStage);
      this.activePointerTargets = [];
      this.activeCapturedPointerTargets = [];
    }

    PointerManager.prototype = Object.create(pSuper.prototype);
    PointerManager.prototype.constructor = PointerManager;

    return PointerManager;
  })(theatre.InputManager);

  global.theatre.PointerManager = PointerManager;

  PointerManager.prototype.down = function(pId, pX, pY, pIsPrimary) {
    var tStage = this.stage;

    if (tStage === null) {
      return;
    }

    var tActors = [];
    var tActor = null;
    var tMatrix;
    var tPoint;
    var tTarget;

    function add(pActor) {
      tActors.push(pActor);
    }

    function capture(pActor) {
      if (tActor === null) {
        tActor = pActor;
      }
    }

    tStage.broadcast('hittest', {
      x: pX,
      y: pY,
      add: add,
      capture: capture
    }, true, true);

    // Do event bubbling.
    if (tActor && tActor.stage !== null) {
      this.activeCapturedPointerTargets[pId] = tActor;
      tMatrix = tActor.getAbsolutePosition();
      tPoint = tMatrix.getPoint(0, 0);
      tActor.emit('pointerdown', {
        id: pId,
        stageX: pX,
        stageY: pY,
        x: pX - tPoint.x, // TODO: rotation and such
        y: pY - tPoint.y, // TODO: rotation and such
        isPrimary: pIsPrimary
      });
      tMatrix.recycle();
    }

    // Do not event bubbling.
    tTarget = this.activePointerTargets[pId];

    if (!tTarget) {
      tTarget = this.activePointerTargets[pId] = [];
    }

    for (var i = 0, il = tActors.length; i < il; i++) {
      tActor = tActors[i];

      if (!tActor || tActor.stage === null) {
        continue;
      }

      tTarget.push(tActor);
      tMatrix = tActor.getAbsolutePosition();
      tPoint = tMatrix.getPoint(0, 0);
      tActor.emit('pointerdown', {
        id: pId,
        stageX: pX,
        stageY: pY,
        x: pX - tPoint.x, // TODO: rotation and such
        y: pY - tPoint.y, // TODO: rotation and such
        isPrimary: pIsPrimary
      });
      tMatrix.recycle();
    }

    tStage.doInvalidations();
  };

  function sendEvent(pType, pId, pX, pY, pIsPrimary, pTerminate) {
    var tStage = this.stage;
    var tActor = this.activeCapturedPointerTargets[pId];
    var tActors = this.activePointerTargets[pId] || [];

    if (pTerminate) {
      this.activeCapturedPointerTargets[pId] = void 0;
      this.activePointerTargets[pId] = void 0;
    }

    if (tStage === null) {
      return;
    }

    if (tActor && tActor.stage !== null) {
      var tMatrix = tActor.getAbsolutePosition();
      var tPoint = tMatrix.getPoint(0, 0);
      tActor.emit(pType, {
        id: pId,
        stageX: pX,
        stageY: pY,
        x: pX - tPoint.x, // TODO: rotation and such
        y: pY - tPoint.y, // TODO: rotation and such
        isPrimary: pIsPrimary
      });
      tMatrix.recycle();
    }

    for (var i = 0, il = tActors.length; i < il; i++) {
      tActor = tActors[i];

      if (!tActor || tActor.stage === null) {
        continue;
      }

      var tMatrix = tActor.getAbsolutePosition();
      var tPoint = tMatrix.getPoint(0, 0);

      tActor.emit(pType, {
        id: pId,
        stageX: pX,
        stageY: pY,
        x: pX - tPoint.x, // TODO: rotation and such
        y: pY - tPoint.y, // TODO: rotation and such
        isPrimary: pIsPrimary
      });
      tMatrix.recycle();
    }

    tStage.doInvalidations();
  }

  PointerManager.prototype.up = function(pId, pX, pY, pIsPrimary) {
    sendEvent.call(this, 'pointerup', pId, pX, pY, pIsPrimary, true);
  };

  PointerManager.prototype.cancel = function(pId, pX, pY, pIsPrimary) {
    sendEvent.call(this, 'pointercancel', pId, pX, pY, pIsPrimary, true);
  };

  PointerManager.prototype.move = function(pId, pX, pY, pIsPrimary) {
    sendEvent.call(this, 'pointermove', pId, pX, pY, pIsPrimary);
  };

  //TODO: enter/leave/over/out ?

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var theatre = global.theatre;

  /**
   * @class
   * @extends {theatre.InputManager}
   */
  var KeyManager = (function(pSuper) {
    function KeyManager(pStage) {
      pSuper.call(this, pStage);
    }

    KeyManager.prototype = Object.create(pSuper.prototype);
    KeyManager.prototype.constructor = KeyManager;

    return KeyManager;
  })(theatre.InputManager);

  theatre.KeyManager = KeyManager;

  KeyManager.prototype.down = function(pUnicode, pAlt, pShift, pCtrl, pMeta, pRepeat) {
    var tStage = this.stage;

    if (tStage === null) {
      return;
    }

    // When we support focusing, use this.stage.currentFocus().cue or whatever it is.
    // TODO: Reactivate bubbling.
    tStage.broadcast('keydown', {
      code: pUnicode,
      key: String.fromCharCode(pUnicode),
      alt: pAlt,
      shift: pShift,
      ctrl: pCtrl,
      meta: pMeta,
      repeat: pRepeat
    }, true, true);

    tStage.doInvalidations();
  };

  KeyManager.prototype.up = function(pUnicode, pAlt, pShift, pCtrl, pMeta) {
    var tStage = this.stage;

    if (tStage === null) {
      return;
    }

    // When we support focusing, use this.stage.currentFocus().cue or whatever it is.
    // TODO: Reactivate bubbling.
    tStage.broadcast('keyup', {
      code: pUnicode,
      key: String.fromCharCode(pUnicode),
      alt: pAlt,
      shift: pShift,
      ctrl: pCtrl,
      meta: pMeta,
      repeat: false
    }, true, true);

    tStage.doInvalidations();
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var theatre = global.theatre;
  var TraversalNode = theatre.TraversalNode;

  theatre.CueManager = CueManager;

  function broadcastCue(pCurrentNode, pData) {
    var tData = pData.data;
    var tName = pData.name;

    pCurrentNode.actor.emit(tName, tData);
  }

  /**
  * A class for handling cues (events)
  * @constructor
  */
  function CueManager(pRootNode) {
    this.rootNode = pRootNode;
  }

  CueManager.prototype.broadcast = function(pName, pData, pBottomUp, pLastToFirst) {
    var tCurrentNode = this.rootNode;

    pData = pData || {};

    var tPackage = {
      data: pData,
      name: pName
    };

    pData.stop = pData.stopNow = function() {};
    pData.phase = 2;

    if (pBottomUp === true) {
      if (pLastToFirst === true) {
        tCurrentNode.processBottomUpLastToFirst(broadcastCue, tPackage);
      }
    } else {
      if (pLastToFirst === false) {
        tCurrentNode.processTopDownFirstToLast(broadcastCue, tPackage);
      }
    }
  };
}(this));

var benri = {
  embed: function(pObject) {
    for (var k in benri) {
      if (benri.hasOwnProperty(k)) {
        pObject[k] = benri[k];
      }
    }
  }
};
/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var theatre = global.theatre;
  var benri = global.benri;

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var AudioManagerProp = (function(pSuper) {
    function AudioManagerProp() {
      pSuper.call(this);
      this.type = 'audio';
      this.context = new benri.media.audio.AudioContext();
    }

    AudioManagerProp.prototype = Object.create(pSuper.prototype);
    AudioManagerProp.prototype.constructor = AudioManagerProp;

    return AudioManagerProp;
  })(theatre.Prop);

  theatre.crews.audio.AudioManagerProp = AudioManagerProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.util = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.util.log = {
  /*
    We use the severity levels as described here
    http://tools.ietf.org/html/rfc5424
   */
  LEVEL_PANIC: 0,
  LEVEL_ALERT: 1,
  LEVEL_CRIT: 2,
  LEVEL_ERROR: 3,
  LEVEL_WARN: 4,
  LEVEL_NOTICE: 5,
  LEVEL_INFO: 6,
  LEVEL_DEBUG: 7
};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var log = benri.util.log;
  
  log.Adapter = Adapter;

  function Adapter(pOptions) {
    pOptions = pOptions || {};

    this.level = 'level' in pOptions ? pOptions.level : log.LEVEL_DEBUG;
  }

  Adapter.prototype.log = function(pLevel, pMessage, pData) {

  };

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function() {

  /**
    * @class
    * @extends {benri.util.log.Adapter}
    */
    var ConsoleAdapter = (function(pSuper) {
     /**
      * @constructor
      * @param {Object} pOptions
      */
      function ConsoleAdapter(pOptions) {
        pSuper.call(this, pOptions);

        this.impl = new (benri.impl.get('log.console').best)();
      }

      var tProto = ConsoleAdapter.prototype = Object.create(pSuper.prototype);
      tProto.constructor = ConsoleAdapter;

      tProto.log = function(pLevel, pMessage, pData) {
        this.impl.log(pLevel, pMessage, pData);
      };

      return ConsoleAdapter;
    })(benri.util.log.Adapter); 

    benri.util.log.ConsoleAdapter = ConsoleAdapter;

  }());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.util.deepCopy = function deepCopy(pSrc, pAutoRelease) {
  if (pSrc === null) {
    return pSrc;
  }

  var i, il, k;
  var tDestArray, tDestObject;

  // Purposly return functions as they are for performance.
  if (typeof pSrc === 'object') {
    if (pAutoRelease && 'cloneAndAutoRelease' in pSrc) {
      return pSrc.cloneAndAutoRelease();
    } else if ('clone' in pSrc) {
      return pSrc.clone();
    }

    if (pSrc.__proto__ === Array.prototype) {
      il = pSrc.length;
      tDestArray = new Array(il);

      for (i = 0; i < il; i++) {
        tDestArray[i] = deepCopy(pSrc[i], pAutoRelease);
      }

      return tDestArray;
    } else {
      tDestObject = {};

      for (k in pSrc) {
        tDestObject[k] = deepCopy(pSrc[k], pAutoRelease);
      }

      return tDestObject;
    }
  }

  return pSrc;
};

(function() {

  benri.util.IndexMap = function IndexMap(pInitialSize) {
    this.nextIndex = 0;
    this.size = pInitialSize;

    for (var i = 0; i < pInitialSize; i++) {
      this[i] = void 0;
    }

    this.add = add;
    this.remove = remove;
  };

  function add(pObject) {
    var tIndex = this.nextIndex;
    var tThisIndex = tIndex;
    var tSize = this.size;

    this[tIndex] = pObject;

    if (tIndex === tSize) {
      tSize = this.size = tSize + 1;
    }

    for (; tIndex < tSize; tIndex++) {
      if (this[tIndex] === void 0) {
        this.nextIndex = tIndex;

        return tThisIndex;
      }
    }

    this.nextIndex = tIndex;
    
    return tThisIndex;
  }

  function remove(pIndex) {
    this[pIndex] = void 0;

    if (pIndex < this.nextIndex) {
      this.nextIndex = pIndex;
    }
  }



  var LinkedNode = benri.util.LinkedNode = function LinkedNode(pData, pPrev) {
    this.data = pData;
    this.next = null;
    this.prev = pPrev;

    this.add = linkedNodeAdd;
    this.remove = linkedNodeRemove;
  };

  function linkedNodeAdd(pData) {
    var tNext = this.next;
    var tNew = this.next = new LinkedNode(pData, this);

    if (tNext !== null) {
      tNew.next = tNext;
      tNext.prev = tNew;
    }

    return tNew;
  }

  function linkedNodeRemove() {
    var tPrev = this.prev;
    var tNext = this.next;

    if (tPrev !== null) {
      tPrev.next = tNext;
    }

    if (tNext !== null) {
      tNext.prev = tPrev;
    }
  }

}());

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.text = {};
benri.net = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var net = benri.net;

  net.Response = Response;

  /**
   * @constructor
   * A response to a Request.
   * @param {number} pStatus The HTTP status code
   * @param {string=''} pStatusText The HTTP status phrase
   * @param {string=''} pHeaders The HTTP headers in raw format
   * @param {benri.content.Blob=} pBody A Blob representing the body
   *  of this response. If the response was of type text, the text
   *  must be properly decoded in to a valid JavaScript string.
   */
  function Response(pStatus, pStatusText, pHeaders, pBody) {
    this.status = pStatus || 0;
    this.statusText = pStatusText || '';
    this.headers = pHeaders || '';
    this.body = pBody || null;
  }

  Response.prototype.getHeader = function(pName) {
    var tHeaders = this.headers;
    var tParts = tHeaders.split('\r\n');
    var tPart;

    for (var i = 0, il = tParts.length; i < il; i++) {
      tPart = tParts[i].split(':');

      if (tPart.length !== 2) {
        continue;
      }

      if (tPart[0].trim() === pName) {
        return tPart[1].trim();
      }
    }

    return null;
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.mem = {};
/**
 * @author Guangyao LIU
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.mem.LRUPool = LRUPool;
  var QueueNode = benri.util.LinkedNode;

  function LRUPool(pOptions) {
    
    pOptions = pOptions || {};


    this._instancePool = {};

    this._lruQueue = {front: null, rear: null};

    this._currentLength = 0;

    this._maxLength = pOptions.maxLength || 10;

    this._indexGenerator = pOptions.indexGenerator || _defaultIndexGenerator;

    this._create = pOptions.create;

    if (!this._create) {
        throw new Error('LRUPool: create() is not defined.');
    }

    this._reset = pOptions.reset;

    if (!this._reset) {
        throw new Error('LRUPool: reset() is not defined.');
    }

    this._destroy = pOptions.destroy;

    if (!this._destroy) {
        throw new Error('LRUPool: destroy() is not defined.');
    }
  }


  LRUPool.prototype.obtain = function(pArgs) {
    var tPool = this._instancePool;
    var tIndex = this._indexGenerator(pArgs);
    var tQueue = this._lruQueue;
    var tInstance;

    // Obtain instance
    var tEntry = tPool[tIndex];

    if (!tEntry) {
      if (this._currentLength === this._maxLength) {
        // Check whether the queue is already full,
        // if so, throw away the least recently used entity(front) of the queue
        this._forceLeave();
      }

      tInstance = this._create(pArgs);

      this._enter(tIndex, tInstance);

    } else {
      tInstance = tEntry.instance;

      this._reset(tInstance);

      // Move instance to the rear of LRU queue
      this._moveToRear(tIndex);
    }

    return tInstance;
  };

  LRUPool.prototype._enter = function (pIndex, pInstance) {
    var tQueue = this._lruQueue;
    var tOldRear = tQueue.rear;
    var tNewRear = new QueueNode(pIndex, tOldRear);

    if (tOldRear !== null) {
      tOldRear.next = tNewRear;
    }
    
    tQueue.rear = tNewRear;
    
    if (!tQueue.front) {
      tQueue.front = tNewRear;
    }

    this._currentLength++;
    this._instancePool[pIndex] = {node: tNewRear, instance: pInstance};
  };

  LRUPool.prototype._forceLeave = function () {
    var tQueue = this._lruQueue;
    var tPool = this._instancePool;
    var tNodeToLeave = tQueue.front;
    var tIndexToDelete;
    var tNewFront;

    if (!tNodeToLeave) {
      return;
    }

    tIndexToDelete = tNodeToLeave.data;
    tNewFront = tNodeToLeave.next;

    tQueue.front = tNewFront;

    if (tNewFront) {
      tNewFront.prev = null;
    } else {
      tQueue.rear = null;
    }

    this._destroy(tPool[tIndexToDelete].instance);

    this._currentLength--;

    delete tPool[tIndexToDelete];
  };

  LRUPool.prototype._moveToRear = function (pIndex) {
    var tQueue = this._lruQueue;
    var tOldRear = tQueue.rear;
    var tRecentNode = this._instancePool[pIndex].node;
    var tPrevNode;
    var tNextNode;

    if (!tRecentNode || tRecentNode === tOldRear) {
      return;
    }

    tPrevNode = tRecentNode.prev;
    tNextNode = tRecentNode.next;

    if (tQueue.front !== tRecentNode) {
      tPrevNode.next = tNextNode;      
    } else {
      tQueue.front = tNextNode;
    }

    tNextNode.prev = tPrevNode;      
    tRecentNode.prev = tOldRear;
    tOldRear.next = tRecentNode;
    tRecentNode.next = null;

    tQueue.rear = tRecentNode;
  };

  function _defaultIndexGenerator(pArgs) {
    var k;
    var index = '';

    for(k in pArgs) {
      index += pArgs[k] + '#';
    }

    return index;
  }

}(this));


/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.mem.InstancePool = InstancePool;

  /**
   * A class that serves as a memory pool of a given type of instance.
   *
   * @constructor
   * @param  {object} pOptions An object containing key-value pairs of parameters.
   *
   *    Valid parameters are:
   *
   *      refill {function} - required
   *        A callback function that allocates the pool's memory.
   *         - 1st param : pool {object} An object to hold pre-allocated instances and other pool-wide data.
   *         - 2nd param : args {array} Arguments to specify when obtain() fails.
   *         - return value : {number} The size of the allocated memory. This will be used as a hint to the memory supervisor.
   *        refill will be invoked when the pool gets empty.
   *        The constructor throws an error if refill is not specified.
   *        The param (pool) is a plane JS object and its internal format depends on the requirement of each data type.
   *        The param (args) is optional and will be set when obtain() returns null.
   *        Clients can freely use the object for efficient memory allocation and/or statistical analysis.
   *
   *      obtain {function} - required
   *        A callback function that returns an instance.
   *         - 1st param : pool {object} An object to hold pre-allocated instances and other pool-wide data.
   *         - 2nd param : args {array} An array containing all arguments.
   *         - return value : {object} An instance obtained from the pool.
   *        obtain will be invoked when InstancePool.obtain() is called.
   *        The constructor throws an error if obtain is not specified.
   *        Note that this callback should return null if the pool gets empty, then refill() will be called.
   *
   *      recycle {function} - required
   *        A callback function that puts an instance back to the pool.
   *         - 1st param : pool {object} An object to hold pre-allocated instances and other pool-wide data.
   *         - 2nd param : instance {object} An instance no longer used.
   *        recycle will be invoked when InstancePool.recycle() is called.
   *        The constructor throws an error if recycle is not specified.
   *
   *      name {string} - optional
   *        The name of the type of the instance.
   *        This will be used in statistics report.
   *
   *      supervisor {benri.mem.MemorySupervisor} - optional
   *        A memory supervisor that oversees the memory usage of this pool.
   *        A pool is not supervised by default.
   *
   *      tag {string} - optional (default : 'generic')
   *        The tag attached to this pool, e.g. 'image'.
   *        If supervisor is specified, it sends a broadcast event when the pool gets empty.
   *        The tag will be attached to that event.
   *
   *      cleanUpCallback {function} - optional
   *        A callback function that frees up the pool's memory that is no loner used.
   *        cleanUpCallback will be invoked when the supervisor's clean-up timer fires up or InstancePool.clean() is called explicitly.
   *         - 1st param : pool {object} An object to hold pre-allocated instances and other pool-wide data.
   *         - return value : {number} Freed memory size. this will be used as a hint to the memory supervisor.
   *        Note that the clean-up timer does not fire up if autoCleanUp is false.
   *
   *      statisticsReportCallback {function} - optional
   *        A callback function that returns type-specific statistics data.
   *        statisticsReportCallback will be invoked when the supervisor's statistics timer fires up.
   *         - 1st param : pool {object} An object to hold pre-allocated instances and other pool-wide data.
   *
   *      autoCleanUp {number} - optional (default : false)
   *        If true, cleanUpCallback will be called on each timer interruput.
   *        Note that this option is valid only when supervisor is specified.
   *
   *      lazyAlloc {boolean} - optional (default : false)
   *        If true, memory is not allocated until it is actually needed.
   *        Otherwise, refill() will be called from within InstancePool's constructor.
   *
   *
   */
  function InstancePool(pOptions) {

    pOptions = pOptions || {};

    /**
     * Holds pre-allocated instances and other pool-wide data.
     * @type {object}
     */
    this._pool = {};

    /**
     * A function that allocates the pool's memory.
     * @type {function} object -> number
     */
    this._refill = pOptions.refill;

    if (!this._refill) {
        throw new Error('InstancePool(' + this._name + ').ctor: refill() is not defined.');
    }

    /**
     * A function that returns an instance.
     * @type {function} object -> array -> object
     */
    this._obtain = pOptions.obtain;

    if (!this._obtain) {
        throw new Error('InstancePool(' + this._name + ').ctor: obtain() is not defined.');
    }

    /**
     * A function that puts an instance back to the pool.
     * @type {function} object -> object -> none
     */
    this._recycle = pOptions.recycle;

    if (!this._recycle) {
        throw new Error('InstancePool(' + this._name + ').ctor: recycle() is not defined.');
    }

    /**
     * The name of the type of the instance.
     * @type {string}
     */
    this._name = pOptions.name || '';

    /**
     * Supervisor that oversees this pool.
     * @type {benri.mem.MemorySupervisor}
     */
    this._supervisor = pOptions.supervisor || null;

    /**
     * The tag attached to this pool.
     * @type {string}
     */
    this._tag = pOptions.tag || 'generic';

    /**
     * If true, cleanUpCallback will be called on each timer interruput.
     * @type {boolean}
     */
    this._autoCleanUp = pOptions.autoCleanUp || false;

    /**
     * A function to clean up the instance pool.
     * @type {function} object -> number
     */
    this._cleanUpCallback = pOptions.cleanUpCallback || null;

    /**
     * A function that returns type-specific statistics data.
     * @type {function} object -> none
     */
    this._statisticsReportCallback = pOptions.statisticsReportCallback || null;

    // Add timer listeners.
    if (this._supervisor) {
      _setUpListeners(this);
    }

    // Pre-allocates the instances.
    if (!pOptions.lazyAlloc) {

      // Check if memory is available.
      var tSupervisor = this._supervisor;
      if (tSupervisor && tSupervisor.isTight()) {
        console.error('InstancePool(' + this._name + ').ctor: Out of memory.');
        // We don't return here and try to continue just for the case of device-specific bug.
      }

      // Fill the pool.
      var tSize = this._refill(this._pool);
      if (tSupervisor) {
        tSupervisor.use(tSize);
      }
    }
  }

  function _setUpListeners(pSelf, pType) {
    var tSupervisor = pSelf._supervisor,
        tListeners, tListener, tSize;

    if ((tListeners = pSelf._supervisorListeners) === void 0) {
      tListeners = pSelf._supervisorListeners = {};
    }

    // Sets up cleanup event listener.
    if (pSelf._cleanUpCallback && (pType === void 0 || pType === 'cleanup')) {
      tListener = function () {
        if (pSelf._autoCleanUp && pSelf._cleanUpCallback) {
          tSize = pSelf._cleanUpCallback(pSelf._pool);
          tSupervisor.use(-tSize);
        }
      };
      tSupervisor.on('cleanup', tListener);
      tListeners['cleanup'] = tListener;
    }

    // Sets up statistics event listener.
    if (pSelf._statisticsReportCallback && (pType === void 0 || pType === 'statistics')) {
      tListener = function () {
        if (pSelf._statisticsReportCallback) {
          pSelf._statisticsReportCallback(pSelf._pool);
        }
      };
      pSelf._supervisor.on('statistics', tListener);
      tListeners['statistics'] = tListener;
    }
  }

  function _setDownListeners(pSelf, pType) {
    var tListeners = pSelf._supervisorListeners;

    for (var k in tListeners) {
      if (pType === void 0 || pType === k) {
        pSelf._supervisor.ignore(k, tListeners[k]);
      }
    }
  }

  /**
   * Allocates an instance from the pool.
   *
   * @parqm {array} pArgs Arguments to initilize the instance.
   * @return {object} The instance allocated from the pool.
   *
   * Returns null if the allocation fails.
   *
   */
  InstancePool.prototype.obtain = function(pArgs) {
    var tPool = this._pool,
        tInstance = this._obtain(tPool, pArgs),
        tSize, tSupervisor, tCallback;

    if (tInstance) {
      return tInstance;
    }

    // Broadcasts a lowMem event.
    if (tSupervisor = this._supervisor) {
      tSupervisor.requestMemory(this._tag);
      tInstance = this._obtain(tPool, pArgs);
    }

    // Refill the pool if empty.
    if (!tInstance) {
      //console.log('InstancePool(' + this._name + ').obtain : Pool gets empty.');
      //if (tCallback = this._statisticsReportCallback) {
      //  tCallback(tPool);
      //}

      // Check if memory is available.
      if (tSupervisor && tSupervisor.isTight()) {
        console.error('InstancePool(' + this._name + ').obtain : Out of memory.');
        // We don't return here and try to continue just for the case of device-specific bug.
      }
      // Allocate a set of instances.
      tSize = this._refill(tPool);
      if (tSupervisor) {
        tSupervisor.use(tSize);
      }
      tInstance = this._obtain(tPool, pArgs);
    }

    return tInstance;
  };

  /**
   * Puts an instance back to the pool.
   * @param {object} pInstance An instance no longer used.
   */
  InstancePool.prototype.recycle = function(pInstance) {

    // Make sure that the instance is not referenced from anywhere.
    if (benri.mem.Keeper.isKeeper(pInstance)) {
      if (pInstance._keepKeys.length > 0) {
        console.warn('InstancePool(' + this._name + ').recycle : Potential memory leak. :', pInstance);
      }
      //pInstance.destroy();
    }

    // Put the instance back to the pool.
    this._recycle(this._pool, pInstance);
  };

  /**
   * Cleans up the live instances.
   */
  InstancePool.prototype.clean = function() {
    var tCallback = this._cleanUpCallback;
    var tSupervisor = this._supervisor, tSize;

    if (tCallback) {
      tSize = tCallback(this._pool);
      if (tSupervisor) {
        tSupervisor.use(tSize);
      }
    }
  };

  /**
   * Overrides the options with given values.
   * @param {object} pOptions Options (see ctor's param.)
   */
  InstancePool.prototype.setOptions = function(pOptions) {
    for (var k in pOptions) {
      if (k === 'supervisor') {
        if (this._supervisor) {
          _setDownListeners(this);
        }
        if (this._supervisor = pOptions[k]) {
          _setUpListeners(this);
        }
      } else if (k === 'cleanUpCallback') {
        if (this._supervisor) {
          if (this._cleanUpCallback) {
            _setDownListeners(this, 'cleanup');
          }
          if (this._cleanUpCallback = pOptions[k]) {
            _setUpListeners(this, 'cleanup');
          }
        }
      } else if (k === 'statisticsReportCallback') {
        if (this._supervisor) {
          if (this._statisticsReportCallback) {
            _setDownListeners(this, 'statistics');
          }
          if (this._statisticsReportCallback = pOptions[k]) {
            _setUpListeners(this, 'statistics');
          }
        }
      } else {
        this['_' + k] = pOptions[k];
      }
    }
  };

  /**
   * Creates an instance pool of the given class with the default configuration.
   *
   * @param {function} pCtor Constructor
   * @param {object} pOptions Options
   *
   *    Valid options are:
   *
   *      allocNum {number} - default : 100
   *        Number of instaces to be allocated when the pool gets empty.
   *
   *      unitSize {number} - default : 1
   *        Approximate number of how many bytes a single instance occupies.
   *
   *      initInstance {function} - default : undefined
   *        A function to set arguments to the instance.
   *         - 1st param : instance {object} An instance to be initialized.
   *         - 2nd param : args {array} Arguments.
   *
   *      name {string} - default : pCtor.name
   *        Name of the class.
   *
   *      override {object}
   *        Overrides the options that passed to InstancePool's constructor.
   *
   * @return {benri.mem.InstancePool} An instance pool.
   *
   */
  benri.mem.createDefaultInstancePool = function (pCtor, pOptions) {
    var pOptions = pOptions || {};
    var mAllocNum = pOptions.allocNum || 100;
    var mUnitSize = pOptions.unitSize || 1;
    var mInitInstance = pOptions.initInstance;
    var mName = pOptions.name;
    var tOverride = pOptions.override;

    var tOptions = {
      refill : function (pPool) {
        var tPool = pPool.data;
        //var tWaterLevel = pPool.waterLevel;
        var tCrudeSum = 0, tInstance, tInstanceData;

        if (!tPool) {
          tPool = pPool.data = [];
        }

/*
        if (!tWaterLevel) {
          // Sets up a water level, an array to keep track of how many instances are used at a given time.
          // waterLevel[0] : holds the number of the instances currently allocated from this pool.
          // waterLevel[1] : holds the peak number of the instances allocated from this pool.
          pPool.waterLevel = [0, 0];
        }
console.log('Alloc: num=' + (mAllocNum - tPool.length));
*/
        for (var i = tPool.length, il = mAllocNum; i < il; i++) {
          tInstance = new pCtor();
          //tInstanceData = tInstance.__instanceData = {};
          //tInstanceData.lastRecycled = new Date();
          tPool.push(tInstance);
          tCrudeSum += mUnitSize;
        }
        return tCrudeSum;
      },

      obtain : function (pPool, pArgs) {
        var tPool = pPool.data;
        //var tWaterLevel = pPool.waterLevel;
        var tInstance, tInstanceData;

        // Never refilled.
        if (!tPool) {
          return null;
        }

        // Allocate the instance from the pool.
        tInstance = tPool.pop();

        // Pool gets empty.
        if (!tInstance) {
          return null;
        }

        // Initialize the instance
        if (pArgs) {
          mInitInstance(tInstance, pArgs);
        }

        // Update the water level.
        //tWaterLevel[0]++; // Current number of the used instances.
        //tWaterLevel[1] = Math.max(tWaterLevel[0], tWaterLevel[1]); // Records the peak number.

        // Attach the instance specific info.
        //tInstanceData = tInstance.__instanceData;
        //tInstanceData.lastObtained = new Date();

        return tInstance;
      },

      recycle : function (pPool, pInstance) {
        var tPool = pPool.data;

/*
        // Never refilled.
        if (!tPool) {
          return;
        }

        var tWaterLevel = pPool.waterLevel;
        var tInstanceData = pInstance.__instanceData;

        // Update the water level.
        tWaterLevel[0]--;
*/

        // Put the instance back to the pool.
        tPool.push(pInstance);

        // Attach the instance specific data.
        //tInstanceData.lastRecycled = new Date();
      },

      name : mName,

      lazyAlloc : true
    };

    // Overrides the options.
    for (var k in tOverride) {
      tOptions[k] = tOverride[k];
    }

    return new benri.mem.InstancePool(tOptions);
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.mem.AutoReleasePool = AutoReleasePool;

  /**
   * A class that keeps references to multiple objects to defer the cost of their releases.
   *
   * Below is the basic usage of the APIs.
   *
   *  // Define a type.
   *  function Class(x, y) {
   *    this.x = x;
   *    this.y = y;
   *  }
   *  
   *  // Create an InstancePool. (see the definition of InstancePool.)
   *  var mInstancePool = new InstancePool({
   *    refill : function () {...}, 
   *    obtain : function () {...},
   *    recycle : function () {...}
   *  });
   *  
   *  // Create an AutoReleasePool.
   *  var mAutoReleasePool = new AutoReleasePool({
   *    release : function (pObject) {
   *      mInstancePool.recycle(pObject);
   *    }  
   *  });
   *  
   *  // [Usage - Typical objects]
   *  
   *  // Wrap the pool's methods around your type.
   *  Class.obtainAndAutoRelease = function (x, y) {
   *    var tInstance = mInstancePool.obtain([x, y]);
   *    mAutoReleasePool.schedule(tInstance);
   *    return tInstance;
   *  };
   *
   *  // Obtain an instance from the pool.
   *  var tInstance = Class.obtainAndAutoRelease(128, 128);
   *
   *  // The instance can be released later at a convenient time.
   *  System.on('idle', function () {
   *    mAutoReleasaePool.release();
   *  });
   *
   *
   *  // [Usage - Keeper]
   *  
   *  // Create an AutoReleasePool.
   *  var mAutoReleasePool = new AutoReleasePool({
   *    release : function (pObject, pArg) {
   *      pObject.release(pArg);
   *    }  
   *  });
   *  
   *  Keeper.keepAndAutoRelease = function (pKeeper) { 
   *    mAutoReleasePool.schedule(pKeeper, pKeeper.keep());
   *  };
   *  
   *  
   * @constructor
   * @param  {object} pOptions An object containing key-value pairs of parameters.
   *
   *    Valid parameters are:
   *
   *      release {function} - required
   *        A callback function that is used for releasing each object in this pool.
   *         - 1st param : obj {object} An object to be released.
   *         - 2nd param : arg {array} An argumet for releasing the object.
   *        release will be invoked when AutoReleasePool.release() is called.
   *        The constructor throws an error if release is not specified.
   *
   */
  function AutoReleasePool(pOptions) {

    pOptions = pOptions || {};

    /**
     * Holds objects to be released.
     * @type {array}
     */
    this._pool = [];

    /**
     * A callback function that is used for releasing each object in this pool.
     * @type {function} object -> arg -> none
     */
    this._release = pOptions.release;

    if (!this._release) {
        throw new Error('AutoReleasePool.ctor: release() is not defined.');
    }
  }

  /**
   * Schedules the release event.
   *
   * @param {object} pObject An object to be released.
   * @param {object} pArg An argumet for releasing the object.
   *
   * The release will be called with the given objects.
   *
   */
  AutoReleasePool.prototype.schedule = function (pObject, pArg) {
    this._pool.push([pObject, pArg]);
  };

  /**
   * Releases all the scheduled objects.
   */
  AutoReleasePool.prototype.release = function() {
    var tPool = this._pool,
        tRelease = this._release, tEntry;

    for (var i = 0, il = tPool.length; i < il; i++) {
      var tEntry = tPool[i];
      tRelease(tEntry[0], tEntry[1]);
    }

    tPool.length = 0;
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.media = {};

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.media.video = {};

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.benri.media.MediaContext = MediaContext;

  /**
   * A class that represents the context for playback of audio and video.
   * @constructor
   */
  function MediaContext() {
    this.table = {};
  }

  /**
   * Adds media renderer to this context.
   *
   * @param {string} pId A unique identifier.
   * @param {benri.media.MediaRenderer} pRenderer A media renderer object.
   */
  MediaContext.prototype.add = function (pId, pRenderer) {
    this.table[pId] = pRenderer;
  };

  /**
   * Removes media renderer from this context.
   *
   * @param {string} pId A unique identifier.
   */
  MediaContext.prototype.remove = function (pId) {
    delete this.table[pId];
  };

  /**
   * Returns media renderer.
   *
   * @param {string} pId A unique identifier.
   * @return {benri.media.MediaRenderer} pRenderer A media renderer object.
   */
  MediaContext.prototype.get = function (pId) {
    return this.table[pId];
  };

  /**
   * Returns all media renderers.
   * @return {Array} A list of media renderer objects.
   */
  MediaContext.prototype.getAll = function () {
    var tTable = this.table, tList = [];

    for (var k in tTable) {
      tList.push(tTable[k]);
    }
    return tList;
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.media.audio = {};

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.benri.media.audio.AudioListener = AudioListener;

  /**
   * A class representing the position and orientation of the person listening to the audio scene.
   * @constructor
   */
  function AudioListener() {
  }

  /**
   * Sets the position of the listener in a 3D cartesian coordinate space.
   *
   * @param {pPosition} An object with properties {x, y ,z} that represents the position of the listener.
   */
  AudioListener.prototype.setPosition = function (pPosition) {
  };

  /**
   * Describes which direction the listener is pointing in the 3D cartesian coordinate space.
   *
   * @param {pFront} An object with properties {x, y ,z} that represents a front direction vector.
   * @param {pUp} An object with properties {x, y, z} that represents an up direction vector.
   */
  AudioListener.prototype.setOrientation = function (pFront, pUp) {
  };

  /**
   * Sets the velocity vector that controls both the direction of travel and the speed in 3D space.
   *
   * @param {pDirection} An object with properties {x, y ,z} that indicates direction of travel and intensity.
   */
  AudioListener.prototype.setVelocity = function (pDirection) {
  };
}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {


  var benri = global.benri;

  var AudioContext = (function(pSuper) {

    /**
     * A class representing audio data ready for playback.
     * @constructor
     */
    function AudioContext() {
      pSuper.call(this);
      this.ducking = false;
    }

    AudioContext.prototype = Object.create(pSuper.prototype);
    AudioContext.prototype.constructor = AudioContext;

    return AudioContext;

  }(benri.media.MediaContext));

  benri.media.audio.AudioContext = AudioContext;

  /**
   * @override
   * pOptions holds the following options:
   *  ducking: {object} Holds volume information with the following format:
   *    {
   *      min: 0.0,
   *      max: 1.0,
   *    }
   */
  AudioContext.prototype.add = function (pId, pRenderer, pOptions) {
    var tOptions = pOptions || {},
        tEntry = {
          renderer: pRenderer
        };
    tEntry.min = tOptions.min === void 0 ? 0.0 : tOptions.min;
    tEntry.max = tOptions.max === void 0 ? 1.0 : tOptions.max;
    this.table[pId] = tEntry;
  };

  /**
   * @override
   */
  AudioContext.prototype.get = function (pId) {
    var tEntry = this.table[pId];
    return tEntry ? tEntry.renderer : null;
  };

  /**
   * @override
   */
  AudioContext.prototype.getAll = function () {
    var tTable = this.table, tList = [];

    for (var k in tTable) {
      tList.push(tTable[k].renderer);
    }
    return tList;
  };

  /**
   * Applies ducking effect.
   * Ducking means lowering the volume of secondary audio tracks when the primary track starts,
   * and lifting the volume again when the primary track is finished.
   *
   * @return {Array} pPrimaries The list of ids of the primary audio tracks.
   */
  AudioContext.prototype.duck = function (pPrimaries) {
    //TODO
  };

  /**
   * Returns AudioListener object that represents the position and orientation of the person listening to the audio scene.
   *
   * @return {benri.media.audio.AudioListener} The listener object for use of 3D spatial sound.
   */
  AudioContext.prototype.getListener = function () {
    //TODO
  };

  /**
   * Enables specific feature(s).
   * @param {string|Array} pFeature A string (or list of string) of the name of the feature to enable.
   * The following features are supported:
   *    'compressor' : Enables the compressor that implements a dynamics compression effect.
   *    TODO Add features.
   */
  AudioContext.prototype.enable = function (pFeature) {
    if (pFeature instanceof global.Array) {
      for (var i = 0, il = pFeature.length; i < il; i++) {
        this.enable(pFeature[i]);
      }
    } else {
      //TODO
    }
  };

  /**
   * Disables specific feature(s).
   * @param {string|Array} pFeature A string (or list of string) of the name of the feature to disable.
   */
  AudioContext.prototype.disable = function (pFeature) {
    if (pFeature instanceof global.Array) {
      for (var i = 0, il = pFeature.length; i < il; i++) {
        this.disable(pFeature[i]);
      }
    } else {
      //TODO
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.io = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Proejct.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.io.compression = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.graphics = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.graphics.shader = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.graphics.shader.Shader = Shader;

  var mShaderIdCounter = 0;

  Shader.TYPE_VERTEX = 0x0;
  Shader.TYPE_CULLING = 0x1;
  Shader.TYPE_FRAGMENT = 0x2;

  /**
   * Base class for all Shaders.
   * @class
   */
  function Shader(pType, pName, pProgram, pUniforms) {
    this.id = ++mShaderIdCounter;

    this.type = pType;

    this.name = pName;

    this.program = pProgram;

    this.enabled = true;

    this.uniqueUniforms = false;

    pProgram.attachShader(this);

    if (pUniforms) {
      for (var k in pUniforms) {
        this.setUniform(k, pUniforms[k]);
      }
    }
  }

  /*
   * Creates and returns a copy of this instace.
   * All shader needs to override clone method.
   * @return {benri.graphics.shader.Shader} Copy of this instance.
   */
  Shader.prototype.clone = function() {
    return new this.constructor(this.type, this.program);
  };

  var encapsulateUniform = Shader.encapsulateUniform = function(pProto, pName, pType) {
    var tMethodName;
    var tFirstChar = pName.charCodeAt(0);

    if (tFirstChar >= 97 && tFirstChar <= 122) {
      // convert to upper case
      tMethodName = String.fromCharCode(tFirstChar - 32) + pName.substring(1);
    } else {
      tMethodName = pName;
    }

    pProto['get' + tMethodName] = (function(pName) {
      return function() {
        return this.getUniform(pName);
      }
    }(pName));

    pProto['set' + tMethodName] = (function(pName) {
      return function(pValue) {
        return this.setUniform(pName, pValue);
      }
    }(pName));

    pProto['getGlobal' + tMethodName] = (function(pName) {
      return function(pValue) {
        return this.getGlobalUniform(pName);
      }
    }(pName));

    pProto['check' + tMethodName + 'Accessed'] = (function(pName) {
      return function(pValue) {
        return this.checkGlobalUniformAccessed(pName);
      }
    }(pName));

    pProto.uniformTypes[pName] = pType;
  };

  Shader.prototype.setUniform = function(pName, pValue) {
    if (this.uniqueUniforms) {
      this.program.setUniform(this.getUniformName(pName), pValue);
    } else {
      this.program.setUniform(pName, pValue);
    }
  };

  Shader.prototype.getUniform = function(pName) {
    if (this.uniqueUniforms) {
      return this.program.getUniform(this.getUniformName(pName));
    } else {
      return this.program.getUniform(pName);
    }
  };

  Shader.prototype.getGlobalUniform = function(pName) {
    return this.program.getGlobalUniform(pName, this.id);
  };

  Shader.prototype.checkGlobalUniformAccessed = function(pName) {
    return this.program.checkGlobalUniformAccessed(pName, this.id);
  };

  Shader.prototype.getUniformName = function(pName) {
    if (this.uniqueUniforms) {
      return 'S_' + this.id + '_' + pName;
    } else {
      return pName;
    }
  };

  Shader.create = function(pType, pName, pSources, pUniforms) {
    var tShader = function(pType, pProgram, pUniforms) {
      Shader.call(this, pType, pName, pProgram, pUniforms);
    }

    var tProto = tShader.prototype = Object.create(Shader.prototype);
    tProto.constructor = tShader;

    tProto.uniformTypes = {};

    for (var k in pUniforms) {
      encapsulateUniform(tProto, k, pUniforms[k]);
    }

    tShader.create = function(pProgram, pUniforms) {
      return new tShader(pType, pProgram, pUniforms);
    };

    return tShader;
  };

  

}(this));



/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.graphics.shader.vertex = {};

(function(global) {

  var Shader = benri.graphics.shader.Shader;

  benri.graphics.shader.vertex.create = function(pName, pSources, pUniforms, pExecute) {
    var tShader = Shader.create(Shader.TYPE_VERTEX, pName, pSources, pUniforms);

    tShader.prototype.execute = pExecute;

    return tShader;
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

theatre.crews.swf.render.ShapeVertexShader = benri.graphics.shader.vertex.create(
  'ShapeVertexShader',
  [
    '$',
      'gSurfaceMatrix:m3',
    '<',
      'inPosition:v2',
    '>',
      'position:v4',
    '=',

    'position = gSurfaceMatrix * inPosition'
  ].join('\n'),
  {

  },
  function(pVertexLocations, pAttributes) {
    return this.program.matrix.transformVectors(pVertexLocations, false);
  }
);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

theatre.crews.swf.render.MorphShapeVertexShader = benri.graphics.shader.vertex.create(
  'MorphShapeVertexShader',
  [
    '$',
      'gRatio:f',
    '<',
      'inEndLocation:v2',
    '>',
      'position:v4',
    '=',

    'point:f = position[0]',
    'position[0] = point + gRatio * inEndLocation[0] - point',
    'point = position[1]',
    'position[1] = point + gRatio * inEndLocation[1] - point'
  ].join('\n'),
  {

  },
  function(pLocations, pAttributes) {
    var tProgram = this.program;
    var tRatio = tProgram.getGlobalUniform('ratio');
    var tActualLocations = new Array(pLocations.length);
    var tEndLocations = pAttributes.endLocation.data;
    var tEndLocation;
    var tLocation;
    var i, il;
    var tX, tY;

    for (i = 0, il = tActualLocations.length; i < il; i++) {
      tLocation = pLocations[i];
      tX = tLocation[0];
      tY = tLocation[1];
      tEndLocation = tEndLocations[i];

      tActualLocations[i] = [
        tX + (tEndLocation[0] - tX) * tRatio,
        tY + (tEndLocation[1] - tY) * tRatio
      ];
    }
        
    return tProgram.matrix.transformVectors(tActualLocations, true);
  }
);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.graphics.shader.fragment = {};

(function() {

  var Shader = benri.graphics.shader.Shader;

  benri.graphics.shader.fragment.create = function(pName, pSources, pUniforms) {
    return Shader.create(Shader.TYPE_FRAGMENT, pName, pSources, pUniforms);
  };

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * A shader that will transform all colours being drawn.
   * @class
   */
  var ColorTransformShader = benri.graphics.shader.fragment.ColorTransformShader = benri.graphics.shader.fragment.create(
    'ColorTransformShader', // name
    [
      '!uTransforms:mf[8]',

      '{',
        'color:mf = $c[0]',
        '$c[0] = color * uTransforms[0] + uTransforms[1]',

        'color:mf = $c[1]',
        '$c[1] = color * uTransforms[2] + uTransforms[3]',

        'color:mf = $c[2]',
        '$c[2] = color * uTransforms[4] + uTransforms[5]',

        'color:mf = $c[3]',
        '$c[3] = color * uTransforms[6] + uTransforms[7]',
      '}'
    ].join('\n'), // sources
    {
      colorTransform: Object,
      alpha: Object,

      hasAdds: Boolean,
      hasAlpha: Boolean,
      hasRed: Boolean,
      hasGreen: Boolean,
      hasBlue: Boolean,
      hasColors: Boolean,
    } // uniforms
  );

  var tProto = ColorTransformShader.prototype;

  tProto.hasAdds = false;
  tProto.hasAlpha = false;
  tProto.hasRed = false;
  tProto.hasGreen = false;
  tProto.hasBlue = false;
  tProto.hasColors = false;

  tProto.updateFlags = function() {
    var tColorTransform = this.getGlobalColorTransform();

    this.redMultiplier = tColorTransform.redMultiplier;
    this.greenMultiplier = tColorTransform.greenMultiplier;
    this.blueMultiplier = tColorTransform.blueMultiplier;
    this.alphaMultiplier = tColorTransform.alphaMultiplier;
    this.redAdd = tColorTransform.redAdd;
    this.greenAdd = tColorTransform.greenAdd;
    this.blueAdd = tColorTransform.blueAdd;
    this.alphaAdd = tColorTransform.alphaAdd;

    this.hasAdds = this.redAdd !== 0 || this.greenAdd !== 0 || this.blueAdd !== 0;
    this.hasAlpha = !!(this.alphaAdd !== 0 || this.alphaMultiplier !== 1);
    var tHasRed = this.hasRed = !!(this.redAdd !== 0 || this.redMultiplier !== 1);
    var tHasGreen = this.hasGreen = !!(this.greenAdd !== 0 || this.greenMultiplier !== 1);
    var tHasBlue = this.hasBlue = !!(this.blueAdd !== 0 || this.blueMultiplier !== 1);

    this.hasColors = tHasRed || tHasGreen || tHasBlue;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

/**
 * A shader that simply adds alpha to what is being drawn.
 * @class
 */
benri.graphics.shader.fragment.AlphaShader = benri.graphics.shader.fragment.create(
  'AlphaShader', // name
  '', // sources
  {
    alpha: Object
  } // uniforms
);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.graphics.render = {
  platform: {}
};

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.graphics.render.Renderable = Renderable;

  /**
   * A simple object for helping managing rendering
   * to RenderContexts.
   * @constructor
   */
  function Renderable() {
    
  }

  /**
   * Renders this Renderable in the given RenderContext.
   * @param  {benri.graphics.render.RenderContext} pRenderContext The RenderContext to render in.
   */
  Renderable.prototype.render = function(pRenderContext) {

  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.graphics.draw = {};

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

/**
 * A shader that simply colours what is being drawn.
 * @class
 */
benri.graphics.shader.fragment.ColorShader = benri.graphics.shader.fragment.create(
  'ColorShader', // name
  [
    '!uColor:v4',

    '{',
      '$c = uColor',
    '}'
  ].join('\n'), // sources
  {
    color: benri.graphics.draw.Color
  } // uniforms
);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.graphics.draw.TextVertexShader = benri.graphics.shader.vertex.create(
  'TextVertexShader',
  [
    
  ].join('\n'),
  {

  },
  function(pLocations, pAttributes) {
    var tProgram = this.program;

    return (
      tProgram.matrix
      .cloneAndAutoRelease()
      .multiply(tProgram.getUniform('textMatrix'))
      .transformVectors(pLocations, false)
    );
  }
);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  function StrokeStyle(pWidth) {
    /**
     * The width of the stroke in pixels.
     * @type {number=1}
     */
    this.width = typeof pWidth === 'number' ? pWidth : 1;

    /**
     * The cap type of this stroke.
     * @type {string="round"}
     */
    this.cap = 'round';

    /**
     * The join type of this stroke.
     * @type {string="round"}
     */
    this.join = 'round';

    /**
     * The miter value of this stroke.
     * Only has an effect if the join is also set to miter.
     * @type {number=10}
     */
    this.miter = 10;
  }

  /*
   * @inheritDoc
   */
  StrokeStyle.prototype.clone = function () {
    var tCopy = new StrokeStyle(this.width);

    tCopy.cap = this.cap;
    tCopy.join = this.join;
    tCopy.miter = this.miter;

    return tCopy;
  };

  global.benri.graphics.draw.StrokeStyle = StrokeStyle;

}(this));

/**
 * @author Guangyao Liu
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  GradientStyle.TYPE_LINEAR = 1;
  GradientStyle.TYPE_RADIAL = 2;

  function GradientStyle(pType) {
    /**
     * The type of this GradientStyle
     * @type {number}
     */
    if (pType !== GradientStyle.TYPE_LINEAR && pType !== GradientStyle.TYPE_RADIAL) {
      this.type = GradientStyle.TYPE_LINEAR;
    } else {
      this.type = pType;
    }

    /**
     * The color stops of gradient
     * @type {array}
     */
    this.colorStops = [];

    /**
     * The color ratio stop of gradient
     * Maximum value is 1.
     * @type {array}
     */
    this.colorRatioStops = [];

    /**
     * The stop colors of gradient
     * @type {array}
     */
    this.stopColors = [];

    /**
     * The position of start point
     * @type {Point}
     */
    this.startPoint = null;

    /**
     * The position of end point
     * @type {Point}
     */
    this.endPoint = null;

    /**
     * The radius of start circle (only for radial gradient)
     * @type {number=0}
     */
    this.startRadius = 0;

    /**
     * The radius of end circle (only for radial gradient)
     * @type {number=0}
     */
    this.endRadius = 0;

    /**
     * The identifier of this gradient style
     * @type {string}
     */
    this.signature = '';
  }

  GradientStyle.prototype.generateSignature = function () {
    var tSignature = this.startPoint + '$' +
                     this.endPoint;

    var tColorStops = this.colorStops;
    var tStopColors = this.stopColors;
    var i = 0, il = tColorStops.length;

    for (; i < il; i++) {
      tSignature += '$' + tColorStops[i]; // +
      //            '$' + tStopColors[i].toCSSString();
      // Color is excluded here considering it could be overwritten by ColorTransform later
    }

    if (this.type === GradientStyle.TYPE_RADIAL) {
      tSignature += '$' + this.startRadius + 
                    '$' + this.endRadius;
    }

    this.signature = tSignature;

    return tSignature;
  };

  GradientStyle.prototype.convertToRatio = function (pNormalizer) {
    var tColorStops = this.colorStops;
    var tColorRatioStops = this.colorRatioStops;

    for (var i = 0, il = tColorStops.length; i < il; i++) {
      tColorRatioStops[i] = tColorStops[i] / pNormalizer;
    }
  };

  global.benri.graphics.draw.GradientStyle = GradientStyle;

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.graphics.draw.Glyph = Glyph;

  /**
   * A class holding glyph data.
   * @class
   * @constructor
   * @param {string} pCharCode Character code assigned to this glyph.
   */
  function Glyph(pCharCode, pPaths) {
    /**
     * Character code assigned to this glyph.
     * @type {string}
     */
    this.code = pCharCode;

    this.paths = pPaths;

    /**
     * Glyph advance in the em square coordinates.
     * @type {number}
     */
    this.advance = 0;
  }

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.graphics.draw.Font = Font;

  /**
   * A class holding font info.
   * All geometric values are represented in the em square coordinates.
   * @class
   * @constructor
   */
  function Font() {

    /**
     * Name of this font.
     * @type {string}
     */
    this.name = '';

    /**
     * The size of the glyph's imaginary square, e.g. EM square.
     * @type {number}
     */
    this.dimension = 1024;

    /**
     * Font ascent.
     * @type {number}
     */
    this.ascent = 0;

    /**
     * Font descent.
     * @type {number}
     */
    this.descent = 0;

    /**
     * Font leading.
     * @type {number}
     */
    this.leading = 0;

    /**
     * Character to glyph mapping.
     * @type {Object}
     * @private
     */
    this._glyph = {};

    /**
     * Whether this is an italic font.
     * @type {bool}
     */
    this.italic = false;

    /**
     * Whether this is a bold font.
     * @type {bool}
     */
    this.bold = false;

    /**
     * Whether this is a system font.
     * @type {bool}
     */
    this.system = false;
  }

  /**
   * Sets the glyph data for a character.
   * @param {number} pCharCode Character code.
   * @param {benri.graphics.draw.Glyph} pGlyph The glyph data.
   */
  Font.prototype.setGlyph = function(pCharCode, pGlyph) {
    this._glyph[pCharCode + ''] = pGlyph;
  };

  /**
   * Retrieve the glyph data for a character.
   * @param {number} pCharCode The character code.
   * @return {benri.graphics.draw.Glyph} The glyph data.
   */
  Font.prototype.getGlyph = function(pCharCode) {
    return this._glyph[pCharCode + ''];
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.graphics.draw.ComponentColor = ComponentColor;

  /**
   * @constructor
   * @param {number} pRed   Red value from 0 to 255.
   * @param {number} pGreen Green value from 0 to 255.
   * @param {number} pBlue  Blue value from 0 to 255.
   * @param {number} pAlpha Alpha value from 0 to 255.
   */
  function ComponentColor(pRed, pGreen, pBlue, pAlpha) {
    this.setRGBA(pRed, pGreen, pBlue, pAlpha);

    this._css = '';
  }

  /**
   * Get the CSS String representation of this colour.
   * @return {string} The CSS String representation of this colour.
   */
  ComponentColor.prototype.toCSSString = function() {
    if (this._dirty) {
      this._dirty = false;

      this._css = 'rgba(' +
        this.red + ',' +
        this.green + ',' +
        this.blue + ',' +
        (this.alpha / 255) + ')';
    }

    return this._css;
  };

  /**
   * Sets this ComponentColor to the specified values.
   * @param {number} pRed   The red value.
   * @param {number} pGreen The green value.
   * @param {number} pBlue  The blue value.
   * @param {number} pAlpha The alpha value.
   */
  ComponentColor.prototype.setRGBA = function(pRed, pGreen, pBlue, pAlpha) {
    this.red = pRed;
    this.green = pGreen;
    this.blue = pBlue;
    this.alpha = pAlpha;

    this._dirty = true;
  };

  /**
   * Gets the red, green, blue and alpha components of
   * this ComponentColor separately.
   * @return {Array.<number>} An array of size 4 that contains each of the colour channels.
   */
  ComponentColor.prototype.getRGBA = function() {
    return [
      this.red,
      this.green,
      this.blue,
      this.alpha
    ];
  };

  /**
   * Gets the copy of this object.
   * @return {benri.graphics.draw.ComponentColor} The copy object.
   */
  ComponentColor.prototype.clone = function() {
    this.toCSSString();
    var tNewColor = new ComponentColor(this.red, this.green, this.blue, this.alpha);
    tNewColor._css = this._css;
    tNewColor._dirty = this._dirty;

    return tNewColor;
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * A class to work with colours easily.
   * @class
   * @extends {Number}
   */
  var Color = (function(pSuper) {
    /**
     * @constructor
     * @param {number} pRed   Red value from 0 to 255.
     * @param {number} pGreen Green value from 0 to 255.
     * @param {number} pBlue  Blue value from 0 to 255.
     * @param {number} pAlpha Alpha value from 0 to 255.
     */
    function Color(pRed, pGreen, pBlue, pAlpha) {
      /**
       * The colour itself is stored as a single number.
       * @type {number}
       */
      this.setRGBA(pRed, pGreen, pBlue, pAlpha);
    }

    Color.prototype = Object.create(pSuper.prototype);
    Color.prototype.constructor = Color;

    /**
     * @inheritDoc
     */
    Color.prototype.valueOf = function() {
      return this.value;
    };

    /**
     * @inheritDoc
     */
    Color.prototype.toString = function() {
      return pSuper.prototype.toString.apply(this.value, arguments);
    }

    /**
     * Get the CSS String representation of this colour.
     * @return {string} The CSS String representation of this colour.
     */
    Color.prototype.toCSSString = function() {
      return this._css;
    };

    /**
     * Sets this Color to the specified values.
     * @param {number} pRed   The red value.
     * @param {number} pGreen The green value.
     * @param {number} pBlue  The blue value.
     * @param {number} pAlpha The alpha value.
     */
    Color.prototype.setRGBA = function(pRed, pGreen, pBlue, pAlpha) {
      /**
       * The colour itself is stored as a single number.
       * @type {number}
       */
      this.value =
        ((pRed ? pRed << 24 : 0) +
        (pGreen ? pGreen << 16 : 0) +
        (pBlue ? pBlue << 8 : 0) +
        (pAlpha ? pAlpha : 0)) >>> 0;

      this._css = 'rgba(' +
        pRed + ',' +
        pGreen + ',' +
        pBlue + ',' +
        (pAlpha / 255) + ')';
    };

    /**
     * Gets the red, green, blue and alpha components of
     * this Color separately.
     * @return {Array.<number>} An array of size 4 that contains each of the colour channels.
     */
    Color.prototype.getRGBA = function() {
      var tValue = this.value;
      return [
        tValue >>> 24 & 0xFF,
        tValue >>> 16 & 0xFF,
        tValue >>> 8 & 0xFF,
        tValue & 0xFF
      ];
    };

    /**
     * Gets the copy of this object.
     * @return {benri.graphics.draw.Color} The copy object.
     */
    Color.prototype.clone = function() {
      var tRGBA = this.getRGBA();
      return new Color(tRGBA[0], tRGBA[1], tRGBA[2], tRGBA[3]);
    };

    return Color;
  })(Number);

  global.benri.graphics.draw.Color = Color;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mActions = theatre.crews.swf.actions;
  var Color = benri.graphics.draw.Color;

  theatre.crews.swf.actionsMap.background = mActions.PREPARE_BACKGROUND = 0x100;

  /**
   * Set's the background colour of the stage.
   * @param {theatre.Actor} pSpriteActor
   * @param {Object} pData The data to use to know what to add.
   */
  theatre.Scene.registerPreparedCallback(
    mActions.PREPARE_BACKGROUND,
    function background(pActor, pData) {
      var tColor = pData.color;
      pActor.player.compositor.camera.backgroundColor = new Color(tColor.red, tColor.green, tColor.blue, tColor.alpha * 255);
    }
  );

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

    var Color = benri.graphics.draw.Color;

    function TextStyle(pFont) {
    /**
    * Font
    * @type {benri.graphics.draw.Font}
    */
    this.font = pFont;

    /**
    * Font height.
    * @type {number}
    */
    this.fontHeight = 0;

    /**
    * Left margin.
    * @type {number}
    */
    this.leftMargin = 0;

    /**
    * Max width.
    * @type {number}
    */
    this.maxWidth = 0;

    /**
    * Actual text width (for glyphs)
    * @type {number}
    */
    this.textWidth = 0;

    /**
    * Top margin.
    * @type {number}
    */
    this.topMargin = 0;

    /**
    * Max height.
    * @type {number}
    */
    this.maxHeight = 0;

    /**
    * Align.
    * @type {string} 'left'/'right'/'center'
    */
    this.align = '';

    /**
    * Wrap.
    * True if the text wraps automatically when the end of line is reached.
    * @type {bool}
    */
    this.wrap = false;

    /**
    * Multiline.
    * True if the text field is multi-line.
    * @type {bool}
    */
    this.multiline = false;

    this.color = new Color(0, 0, 0, 255);

    }

    TextStyle.prototype.clone = function() {
        var tCopy = new TextStyle(this.font);

        tCopy.fontHeight = this.fontHeight;
        tCopy.leftMargin = this.leftMargin;
        tCopy.maxWidth = this.maxWidth;
        tCopy.textWidth = this.textWidth;
        tCopy.topMargin = this.topMargin;
        tCopy.maxHeight = this.maxHeight;
        tCopy.align = this.align;
        tCopy.wrap = this.wrap;
        tCopy.multiline = this.multiline;
        tCopy.color = this.color.clone();

        return tCopy;
    };

    global.benri.graphics.draw.TextStyle = TextStyle;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.geometry = {};

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

/**
 * @class
 */
benri.graphics.shader.fragment.RadialGradientShader = benri.graphics.shader.fragment.create(
  'RadialGradientShader', // name
  [

  ].join('\n'), // sources
  {
    gradientStyle: benri.graphics.draw.GradientStyle,
    matrix: benri.geometry.Matrix2D
  } // uniforms
);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

/**
 * @class
 */
benri.graphics.shader.fragment.LinearGradientShader = benri.graphics.shader.fragment.create(
  'LinearGradientShader', // name
  [

  ].join('\n'), // sources
  {
    gradientStyle: benri.graphics.draw.GradientStyle,
    matrix: benri.geometry.Matrix2D
  } // uniforms
);

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

/**
 * A shader that allows to you use an Image
 * as a pattern over a shape when drawing.
 * @class
 */
benri.graphics.shader.fragment.ImageShader = benri.graphics.shader.fragment.create(
  'ImageShader', // name
  [

  ].join('\n'), // sources
  {
    tileMode: String,
    image: benri.graphics.Image,
    matrix: benri.geometry.Matrix2D
  } // uniforms
);
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var geometry = benri.geometry;

  function VertexBuffer(pLocationSize) {
    this.locations = [];

    this._locationIndex = 0;
    this.locationSize = pLocationSize;

    this.attributes = {};

    this._attributeIndicies = {};

    this.length = 0;

    this.registerAttribute = registerAttribute;
    this.write = write;
    this.read = read;
    this.seek = seek;
    this.tell = tell;
    this.clone = clone;
    this.concat = concat;
    this.getBoundingRect = getBoundingRect;
  }

  VertexBuffer.create = function(pLocationSize, pLocations, pAttributes) {
    var tNewVertexBuffer = new VertexBuffer(pLocationSize);

    var tLength = tNewVertexBuffer.length = pLocations.length

    tNewVertexBuffer._locationIndex = tLength;
    tNewVertexBuffer.locations = pLocations;

    if (pAttributes) {
      var tNewAttributes = tNewVertexBuffer.attributes;
      var tNewAttributeIndicies = tNewVertexBuffer._attributeIndicies;
      var tAttribute;

      for (var k in pAttributes) {
        tAttribute = pAttributes[k];

        tNewAttributes[k] = {
          data: tAttribute.data,
          size: tAttribute.size
        };

        tNewAttributeIndicies[k] = tAttribute.data.length;
      }
    }

    return tNewVertexBuffer;
  };

  function registerAttribute(pName, pElementSize) {
    if (!(pName in this._attributeIndicies)) {
      this._attributeIndicies[pName] = 0;
      this.attributes[pName] = {
        data: new Array(this.length),
        size: pElementSize
      }
    }
  }

  function write(pLocation, pAttributes) {
    var tIndex;
    var i, il;
    var k;
    var tAttributes = this.attributes;
    var tAttribute;
    var tAttributeData;
    var tNewAttribute;
    var tNewAttributeData;
    var tAttributeIndicies = this._attributeIndicies;

    this.locations[this._locationIndex++] = pLocation;

    for (k in tAttributes) {
      tAttribute = tAttributes[k];
      tAttributeData = tAttribute.data;
      tIndex = tAttributeIndicies[k];
      tNewAttribute = pAttributes[k];

      if (tNewAttribute) {
        tAttributeData[tIndex] = tNewAttribute;
      } else {
        il = tAttribute.size;

        tAttributeData[tIndex] = tNewAttributeData = new Array(il);

        for (i = 0; i < il; i++) {
          tNewAttributeData[i] = 0;
        }
      }

      tAttributeIndicies[k] = tIndex + 1;
    }

    var tTell = this.tell();

    if (tTell > this.length) {
      this.length = tTell;
    }
  }

  function read() {
    var i = this._locationIndex;

    if (i >= this.locations.length) {
      return null;
    }

    var k;
    var tAttributes = this.attributes;
    var tAttributeIndicies = this._attributeIndicies;

    var tPackage = {
      location: this.locations[i].slice(0)
    };

    this._locationIndex = i + 1;

    for (k in tAttributes) {
      tPackage[k] = tAttributes[k].data[tAttributeIndicies[k]++].slice(0);
    }

    return tPackage;
  }

  function seek(pIndex) {
    var tAttributeIndicies = this._attributeIndicies;
    var tAttributes = this.attributes;

    this._locationIndex = pIndex;

    for (var k in tAttributeIndicies) {
      tAttributeIndicies[k] = pIndex;
    }
  }

  function tell() {
    return this._locationIndex;
  }

  function clone() {
    var tNewVertexBuffer = new VertexBuffer(this.locationSize);

    tNewVertexBuffer.length = this.length;

    tNewVertexBuffer._locationIndex = this._locationIndex;
    tNewVertexBuffer.locations = this.locations.slice(0);

    var tAttributes = this.attributes;
    var tAttributeIndicies = this._attributeIndicies;
    var tNewAttributes = tNewVertexBuffer.attributes;
    var tNewAttributeIndicies = tNewVertexBuffer._attributeIndicies;

    for (var k in tAttributes) {
      tNewAttributes[k] = {
        data: tAttributes[k].data.slice(0),
        size: tAttributes[k].size
      };

      tNewAttributeIndicies[k] = tAttributeIndicies[k];
    }

    return tNewVertexBuffer;
  }

  function concat(pBuffer) {

    // Check the dimension mismatch.
    if (this.locationSize !== pBuffer.locationSize) {
      return null;
    }

    var tThisAttributes = this.attributes,
        tThatAttributes = pBuffer.attributes,
        tTypeMismatch = false, tThisAttr, tThatAttr,
        tThisData, tThatData, i, j, il,
        tNewLength = this.length + pBuffer.length;

    for (var k in tThisAttributes) {

      // If not share the same attribute, die.
      if (!(tThatAttr = tThatAttributes[k])) {
        tTypeMismatch = true;
        break;
      }

      tThisAttr = tThisAttributes[k];

      // If the attribute's types mismatch, die.
      if (tThisAttr.size !== tThatAttr.size) {
        tTypeMismatch = true;
        break;
      }

      // Concatenates the vertex attributes.
      tThisData = tThisAttr.data;
      tThatData = tThatAttr.data;
      for (i = tThisData.length, j = 0, il = i + tThatData.length; i < il; i++, j++) {
        tThisData[i] = tThatData[j];
      }
    }

    // Check the attributes type mismatch.
    if (tTypeMismatch) {
      return null;
    }

    // Concatenates the verticies.
    tThisData = this.locations;
    tThatData = pBuffer.locations;
    for (i = tThisData.length, j = 0, il = i + tThatData.length; i < il; i++, j++) {
      tThisData[i] = tThatData[j];
    }
    this.length = tNewLength;

    // Move the cursor to the end.
    seek(this.length - 1);

    return this;
  }

  function getBoundingRect() {
    if (this.locationSize !== 2) {
      // Can't handle this right now...
      return null;
    }

    var tMinX = Infinity;
    var tMinY = Infinity;
    var tMaxX = -Infinity;
    var tMaxY = -Infinity;

    var tLocations = this.locations;
    var tLocation;

    var tX, tY;

    for (var i = 0, il = this.length; i < il; i++) {
      tLocation = tLocations[i];
      tX = tLocation[0];
      tY = tLocation[1];

      if (tX < tMinX) {
        tMinX = tX;
      }

      if (tX > tMaxX) {
        tMaxX = tX;
      }

      if (tY < tMinY) {
        tMinY = tY;
      }

      if (tY > tMaxY) {
        tMaxY = tY;
      }
    }

    return geometry.Rect.obtain(tMinX, tMinY, tMaxX - tMinX, tMaxY - tMinY);
  }

  geometry.VertexBuffer = VertexBuffer;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.geometry.Point = Point;

  /**
   * A class that holds an x and y position.
   * @class
   * @constructor
   * @param {number} pX X
   * @param {number} pY Y
   */
  function Point(pX, pY) {
    this.x = pX;
    this.y = pY;
  }

  /**
   * Transform this Point by the given matrix.
   * @param  {benri.geometry.Matrix2D} pMatrix The matrix to transform by.
   */
  Point.prototype.transform = function(pMatrix) {
    var tNewPoint = pMatrix.getPoint(this.x, this.y);
    this.x = tNewPoint.x;
    this.y = tNewPoint.y;

    return this;
  };

  /**
   * Get a clone of this Point.
   * @return {benri.geometry.Point} The clone.
   */
  Point.prototype.clone = function() {
    return new Point(this.x, this.y);
  };

  /**
   * Creates an array of Point objects
   * from the list of arguments.
   * The arguments must be in the format
   *   x0, y0, x1, y1, x2, y2, etc...
   * @return {Array.<benri.geometry.Point>}
   */
  Point.array = function() {
    var tArguments = arguments;
    var i, il = tArguments.length;
    var tCounter;
    var tArray = new Array(il / 2);

    for (i = 0, tCounter = 0; i < il; i += 2, tCounter++) {
      tArray[tCounter] = new Point(tArguments[i], tArguments[i + 1]);
    }

    return tArray;
  };

  Point.prototype.toString = function () {
    return this.x + ',' + this.y;
  };
}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Point = benri.geometry.Point;
  var VertexBuffer = benri.geometry.VertexBuffer;

  benri.geometry.Path = Path;

  /**
   * @class
   * @constructor
   * @param {number} pStartX The start x position
   * @param {number} pStartY The start y position
   */
  function Path(pStartX, pStartY) {
    // Create a 2D VertexBuffer.
    var tBuffer = this.buffer = new VertexBuffer(2);

    // Register a vertex attribute for the vector operation
    // Ops are:
    //   0x1 Move Point
    //   0x2 Line Anchor
    //   0x3 Curve Control Anchor
    tBuffer.registerAttribute('vectorOp', 1);

    if (!pStartX) {
      pStartX = 0;
    }
    if (!pStartY) {
      pStartY = 0;
    }

    this.m(pStartX, pStartY);
  }

  /**
   * Get a clone of this Path.
   * @return {benri.geometry.Path} The clone.
   */
  Path.prototype.clone = function() {
    var tNewPath = new Path(0, 0);
    tNewPath.buffer = this.buffer.clone();

    return tNewPath;
  };

  /**
   * Gets the bounds of this Path.
   * @return {benri.geometry.Rect} The bounds.
   */
  Path.prototype.getBoundingRect = function() {
    return this.buffer.getBoundingRect();
  };

  /**
   * Move to the specified location without
   * joining to the current point.
   * @param  {number} pX The X location.
   * @param  {number} pY The Y location.
   * @return {benri.geometry.Path} This.
   */
  Path.prototype.moveTo = Path.prototype.m = function(pX, pY) {
    this.buffer.write(
      [pX, pY],
      {
        vectorOp: [0x1]
      }
    );

    return this;
  };

  /**
   * Move to the specified location while joining
   * to the current point.
   * @param  {number} pX The X location.
   * @param  {number} pY The Y location.
   * @return {benri.geometry.Path} This.
   */
  Path.prototype.lineTo = Path.prototype.l = function(pX, pY) {
    this.buffer.write(
      [pX, pY],
      {
        vectorOp: [0x2]
      }
    );

    return this;
  };

  /**
   * Do a quadratic curve to the specified location while joining
   * to the current point.
   * @param {number} pControlX The control X location.
   * @param {number} pControlY The controlY location.
   * @param  {number} pX The X location.
   * @param  {number} pY The Y location.
   * @return {benri.geometry.Path} This.
   */
  Path.prototype.quadraticCurveTo = Path.prototype.qc = function(pControlX, pControlY, pX, pY) {
    var tBuffer = this.buffer;

    tBuffer.write(
      [pControlX, pControlY],
      {
        vectorOp: [0x3]
      }
    );

    tBuffer.write(
      [pX, pY],
      {
        vectorOp: [0x2]
      }
    );

    return this;
  };

  Path.prototype.concat = function(pPath) {
    this.buffer.concat(pPath.buffer);
    return this;
  };

  //TODO: Add more functions for drawing paths.

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var geometry = global.benri.geometry;
  var Path = geometry.Path;

  /**
   * A closed shape made up of multiple verticies.
   * @param {Array.<benri.geometry.Point>} pVerticies The list of verticices that make up this Polygon.
   */
  function Polygon(pVerticies) {
    this.verticies = pVerticies.slice(0);
  }

  /**
   * Get a clone of this Polygon.
   * @return {benri.geometry.Polygon} The clone.
   */
  Polygon.prototype.clone = function() {
    return new Polygon(this.verticies);
  };

  /**
   * Converts this polygon to an array.
   * @return {Array.<benri.geometry.Point>} The data.
   */
  Polygon.prototype.getArray = function() {
    return this.verticies.slice(0);
  };

  /**
   * Get a representation of this Polygon as a Path.
   * @return {benri.geometry.Path} The path.
   */
  Polygon.prototype.getPath = function() {
    var tVerticies = this.verticies;
    var tPath = new Path(tVerticies[0], tVerticies[1]);

    for (var i = 2, il = tVerticies.length; i < il; i += 2) {
      tPath.l(tVerticies[i], tVerticies[i + 1]);
    }

    tPath.l(tVerticies[0], tVerticies[1]);

    return tPath;
  };

  /**
   * Transforms this Polygon via the given Matrix
   * @param  {benri.geometry.Matrix2D} pMatrix The Matrix to transform with
   * @return {benri.geometry.Polygon} This Polygon.
   */
  Polygon.prototype.transform = function(pMatrix) {
    var tVerticies = this.verticies;

    for (var i = 0, il = tVerticies.length; i < il; i += 2) {
      pMatrix.transformVectorInArray(tVerticies, i);
    }

    return this;
  };

  Polygon.prototype.getBoundingRect = function() {
    var tMinX = Infinity;
    var tMinY = Infinity;
    var tMaxX = -Infinity;
    var tMaxY = -Infinity;
    var tVerticies = this.verticies;
    var tX, tY;

    for (var i = 0, il = tVerticies.length; i < il; i += 2) {
      tX = tVerticies[i];
      tY = tVerticies[i + 1];

      if (tX < tMinX) {
        tMinX = tX;
      }

      if (tX > tMaxX) {
        tMaxX = tX;
      }

      if (tY < tMinY) {
        tMinY = tY;
      }

      if (tY > tMaxY) {
        tMaxY = tY;
      }
    }

    return geometry.Rect.obtain(tMinX, tMinY, tMaxX - tMinX, tMaxY - tMinY);
  };

  /**
   * Check whether this Polygon has the same verticies as the given Polygon.
   * @param {benri.geometry.Polygon} pPolygon
   * @return {boolean} True if the Polygons have the same verticies.
   */
  Polygon.prototype.equals = function(pPolygon) {
    var tVerticies = this.verticies;
    var tThatVerticies = pPolygon.verticies;
    var i, il = tVerticies.length;

    if (il !== tThatVerticies.length) {
      return false;
    }

    for (i = 0; i < il; i++) {
      if (tVerticies[i] !== tThatVerticies[i]) {
        return false;
      }
    }

    return true;
  };

  /**
   * Checks to see if the give point lays inside of this Polygon.
   * @param  {benri.geometry.Point}  pPoint The Point to check
   * @return {boolean} True if the point is inside, false otherwise
   */
  Polygon.prototype.isPointInside = function(pX, pY) {
    // http://www.ecse.rpi.edu/~wrf/Research/Short_Notes/pnpoly.html
    // Copyright (c) 1970-2003, Wm. Randolph Franklin
    // This algorithm is an adoption of the C function on
    // the website listed above. For full license notes
    // please see the LICENSE file included with this source code.

    var tVerticies = this.verticies;
    var tNumOfVerticies = tVerticies.length;

    var i, j, tResult = false;

    for (i = 0, j = tNumOfVerticies - 2; i < tNumOfVerticies; j = i, i += 2) {
      if (
        ((tVerticies[i + 1] > pY) !== (tVerticies[j + 1] > pY)) &&
        (pX < (tVerticies[j] - tVerticies[i]) * (pY - tVerticies[i + 1]) / (tVerticies[j + 1] - tVerticies[i + 1]) + tVerticies[i])
        ) {
        tResult = !tResult;
      }
    }

    return tResult;
  };


  geometry.Polygon = Polygon;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var mem = global.benri.mem;
  var geometry = global.benri.geometry;
  var Polygon = geometry.Polygon;

  var mInstancePoolEnabled = true;

  /**
   * A class that holds information about a rectangle
   * @class
   * @extends {benri.geometry.Polygon}
   */
  var Rect = geometry.Rect = (function(pSuper) {
    /**
     * @constructor
     * @class
     */
    function Rect() {
      this.verticies = [0, 0, 0, 0, 0, 0, 0, 0];
      this.originX = 0;
      this.originY = 0;
      this.perpendicularWidth = 0;
      this.perpendicularHeight = 0;
    }

    Rect.prototype = Object.create(pSuper.prototype);
    Rect.prototype.constructor = Rect;

    /**
     * init
     * @param {number} pX The X position for the origin.
     * @param {number} pY The Y position for the origin.
     * @param {number} pWidth The width of the Rect.
     * @param {number} pHeight The height of the Rect.
     */
    Rect.prototype.init = function (pX, pY, pWidth, pHeight) {
      var tVerticies = this.verticies;

      tVerticies[0] = pX;
      tVerticies[1] = pY;
      tVerticies[2] = pX + pWidth;
      tVerticies[3] = pY;
      tVerticies[4] = pX + pWidth;
      tVerticies[5] = pY + pHeight;
      tVerticies[6] = pX;
      tVerticies[7] = pY + pHeight;

      /**
       * The origin (top left) of this Rect.
       * @type {benri.geometry.Point}
       */
      this.originX = tVerticies[0];
      this.originY = tVerticies[1];
      this.perpendicularWidth = pWidth;
      this.perpendicularHeight = pHeight;

      return this;
    };

    Rect.prototype.setWidth = function(pValue) {
      var tVerticies = this.verticies;
      return tVerticies[2] = tVerticies[4] = tVerticies[0] + pValue;
    };

    Rect.prototype.setHeight = function(pValue) {
      var tVerticies = this.verticies;
      return tVerticies[5] = tVerticies[7] = tVerticies[1] + pValue;
    };

    Rect.prototype.setOriginX = function(pValue) {
      var tShift = pValue - this.originX;
      
      if (tShift) {
        var tVerticies = this.verticies;
        tVerticies[0] += tShift;
        tVerticies[2] += tShift;
        tVerticies[4] += tShift;
        tVerticies[6] += tShift;

        this.originX = pValue;
      }
    };

    Rect.prototype.setOriginY = function(pValue) {
      var tShift = pValue - this.originY;

      if (tShift) {
        var tVerticies = this.verticies;
        tVerticies[1] += tShift;
        tVerticies[3] += tShift;
        tVerticies[5] += tShift;
        tVerticies[7] += tShift;

        this.originY = pValue;
      }
    };

    Rect.prototype.getWidth = function() {
      var tVerticies = this.verticies;
      return tVerticies[2] - tVerticies[0];
    };

    Rect.prototype.getHeight = function() {
      var tVerticies = this.verticies;
      return tVerticies[7] - tVerticies[1];
    };

    /**
     * Gets a normal Polygon that has the same verticies
     * as this Rect.
     * @return {benri.geometry.Polygon}
     */
    Rect.prototype.getPolygon = function() {
      return pSuper.prototype.clone.call(this);
    };

    /**
     * Get a clone of this Rect.
     * @return {benri.geometry.Rect} The clone.
     */
    Rect.prototype.clone = function() {
      return Rect.obtain(this.originX, this.originY, this.getWidth(), this.getHeight());
    };

    /**
     * Transforms this Rect via the given Matrix.
     * Note that this will not allow you to
     * warp this Rect to something that is not a Rect
     * anymore. It will also not allow you to rotate
     * the points in this Rect.
     * Instead, it will calculate the bounding Rect for
     * the transformed Rect and set that bounding Rect's
     * verticies as the verticies for this Rect.
     * @return {benri.geometry.Rect} This Rect.
     */
    Rect.prototype.transform = function(pMatrix) {
      pSuper.prototype.transform.call(this, pMatrix);

      var tBoundingRect = this.getBoundingRect();
      var tBoundingVerticies = tBoundingRect.verticies;

      this._updatePerpendicularSize();

      var tVerticies = this.verticies;

      tVerticies[0] = tBoundingVerticies[0];
      tVerticies[1] = tBoundingVerticies[1];
      tVerticies[2] = tBoundingVerticies[2];
      tVerticies[3] = tBoundingVerticies[3];
      tVerticies[4] = tBoundingVerticies[4];
      tVerticies[5] = tBoundingVerticies[5];
      tVerticies[6] = tBoundingVerticies[6];
      tVerticies[7] = tBoundingVerticies[7];

      this.originX = tBoundingVerticies[0];
      this.originY = tBoundingVerticies[1];

      tBoundingRect.recycle();

      return this;
    };

    return Rect;
  })(benri.geometry.Polygon);


  /**
   * Merge this rect with the given rect and return the new rect.
   * @param {benri.geometry.Rect} pRect
   * @return {benri.geometry.Rect} The merged rect.
   */
  Rect.prototype.merge = function(pRect) {
    var tPointAX, tPointAY, tPointBX, tPointBY,
        tMinX, tMinY, tMaxX, tMaxY;

    tPointAX = this.originX;
    tPointAY = this.originY;
    tPointBX = pRect.originX;
    tPointBY = pRect.originY;
    tMinX = tPointAX < tPointBX ? tPointAX : tPointBX;
    tMinY = tPointAY < tPointBY ? tPointAY : tPointBY;

    tPointAX = this.verticies[4];
    tPointAY = this.verticies[5];
    tPointBX = pRect.verticies[4];
    tPointBY = pRect.verticies[5];
    tMaxX = tPointAX > tPointBX ? tPointAX : tPointBX;
    tMaxY = tPointAY > tPointBY ? tPointAY : tPointBY;

    this.setOriginX(tMinX);
    this.setOriginY(tMinY);
    this.setWidth(tMaxX - tMinX);
    this.setHeight(tMaxY - tMinY);

    this._updatePerpendicularSize();

    return this;
  };

  Rect.prototype._updatePerpendicularSize = function () {
    var tVerticies = this.verticies, tX, tY;
    tX = tVerticies[2] - tVerticies[0];
    tY = tVerticies[3] - tVerticies[1];
    this.perpendicularWidth = Math.sqrt(Math.pow(tX, 2) + Math.pow(tY, 2));
    tX = tVerticies[4] - tVerticies[2];
    tY = tVerticies[5] - tVerticies[3];
    this.perpendicularHeight = Math.sqrt(Math.pow(tX, 2) + Math.pow(tY, 2));
  };

  Rect.prototype.getPerpendicularWidth = function () {
    return this.perpendicularWidth;
  };

  Rect.prototype.getPerpendicularHeight = function () {
    return this.perpendicularHeight;
  };

  // Supports InstancePool.

  if (mInstancePoolEnabled) {

    var mInstancePool = mem.createDefaultInstancePool(Rect, {
      allocNum : 500,
      initInstance : function (pInstance, pArgs) {
        // Initialize the instance
        var pX = pArgs[0];
        var pY = pArgs[1];
        var pWidth = pArgs[2];
        var pHeight = pArgs[3];

        pInstance.init(pX, pY, pWidth, pHeight);
      },
    });

    // Wrap the pool's methods around your type.
    Rect.obtain = function (pX, pY, pWidth, pHeight) {
      return mInstancePool.obtain([pX, pY, pWidth, pHeight]);
    };

    Rect.prototype.recycle = function () {
      mInstancePool.recycle(this);
    };

  } else {

    // Wrap the pool's methods around your type.
    Rect.obtain = function (pX, pY, pWidth, pHeight) {
      return (new Rect()).init(pX, pY, pWidth, pHeight);
    };

    Rect.prototype.recycle = function () {
      ;
    };

  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var ButtonBoundsProp = (function(pSuper) {
    var Rect = benri.geometry.Rect;

    /**
     * @constructor
     */
    function ButtonBoundsProp() {
      pSuper.call(this);
      
      this.type = 'bounds';
    }
  
    var tProto = ButtonBoundsProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = ButtonBoundsProp;

    tProto.getBounds = function getBounds() {
      return this.actor.hitTestActor.props.bounds.getBounds();
    };
  
    tProto.getLocalBounds = function getLocalBounds() {
      return this.actor.hitTestActor.props.bounds.getLocalBounds();
    };

    tProto.getAbsoluteBounds = function getAbsoluteBounds() {
      return this.actor.hitTestActor.props.bounds.getAbsoluteBounds();
    };

    return ButtonBoundsProp;
  })(theatre.Prop);

  theatre.crews.swf.props.ButtonBoundsProp = ButtonBoundsProp;

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var mem = benri.mem;
  var Point = benri.geometry.Point;

  var mInstancePoolEnabled = true;

  benri.geometry.Matrix2D = Matrix2D;

  function Transforms() {
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
  }

  Transforms.prototype.apply = function(pMatrix) {
    var tX = pMatrix.e;
    var tY = pMatrix.f;
    var tAngle = this.rotation;

    pMatrix.reset();

    pMatrix.e = tX;
    pMatrix.f = tY;
    pMatrix.a = this.scaleX;
    pMatrix.d = this.scaleY;

    pMatrix.multiply({
      a: Math.cos(tAngle),
      b: -Math.sin(tAngle),
      c: Math.sin(tAngle),
      d: Math.cos(tAngle),
      e: 0,
      f: 0
    });

    pMatrix.transforms = this;
  };

  /**
   * @constructor
   * @class
   * @param {Array.<number>=} pMatrixArray An array of numbers to fill this matrix with.
   */
  function Matrix2D(pMatrixArray) {
    /**
     * Scale X
     * @type {number}
     */
    this.a = 1;

    /**
     * Skew Y
     * @type {number}
     */
    this.b = 0;

    /**
     * Skew X
     * @type {number}
     */
    this.c = 0;

    /**
     * Scale Y
     * @type {number}
     */
    this.d = 1;

    /**
     * Translate X
     * @type {number}
     */
    this.e = 0;

    /**
     * Translate Y
     * @type {number}
     */
    this.f = 0;

    this.transforms = null;

    if (pMatrixArray) {
      this.set(pMatrixArray);
    }
  }

  Matrix2D.prototype._syncTransforms = function() {
    var tTransforms = this.transforms;

    if (tTransforms === null) {
      tTransforms = new Transforms();

      tTransforms.scaleX = this.getScaleX();
      tTransforms.scaleY = this.getScaleY();
      tTransforms.rotation = this.getRotation();

      this.transforms = tTransforms;
    }

    return tTransforms;
  };

  /**
   * Checks to see if this matrix is the same as another
   * @param  {benri.geometry.Matrix2D} pMatrix The matrix to check against.
   * @return {boolean} True of the are the same, false otherwise.
   */
  Matrix2D.prototype.equals = function(pMatrix) {
    if (this.a !== pMatrix.a) return false;
    if (this.b !== pMatrix.b) return false;
    if (this.c !== pMatrix.c) return false;
    if (this.d !== pMatrix.d) return false;
    if (this.e !== pMatrix.e) return false;
    if (this.f !== pMatrix.f) return false;

    return true;
  };

  Matrix2D.prototype.equalsVector = function(pVector) {
    if (this.a !== pVector[0]) return false;
    if (this.b !== pVector[1]) return false;
    if (this.c !== pVector[2]) return false;
    if (this.d !== pVector[3]) return false;
    if (this.e !== pVector[4]) return false;
    if (this.f !== pVector[5]) return false;

    return true;
  };

  /**
   * Populates this matrix with data.
   * @param  {Array.<number>} pMatrixArray The data.
   */
  Matrix2D.prototype.set = function(pMatrixArray) {
    this.a = pMatrixArray[0];
    this.b = pMatrixArray[1];
    this.c = pMatrixArray[2];
    this.d = pMatrixArray[3];
    this.e = pMatrixArray[4];
    this.f = pMatrixArray[5];

    this.transforms = null;

    return this;
  };

  /**
   * Converts this matrix to an array.
   * @return {Array.<number>} The data.
   */
  Matrix2D.prototype.getArray = function() {
    return [
        this.a,
        this.b,
        this.c,
        this.d,
        this.e,
        this.f
      ];
  };

  /**
   * Sets this matrix to the identity matrix.
   */
  Matrix2D.prototype.reset = function() {
    /**
     * Scale X
     * @type {number}
     */
    this.a = 1;

    /**
     * Skew Y
     * @type {number}
     */
    this.b = 0;

    /**
     * Skew X
     * @type {number}
     */
    this.c = 0;

    /**
     * Scale Y
     * @type {number}
     */
    this.d = 1;

    /**
     * Translate X
     * @type {number}
     */
    this.e = 0;

    /**
     * Translate Y
     * @type {number}
     */
    this.f = 0;

    this.transforms = null;

    return this;
  }

  /**
   * Tests if this is the identity matrix.
   */
  Matrix2D.prototype.isIdentity = function() {
    return (this.a === 1
        && this.b === 0
        && this.c === 0
        && this.d === 1
        && this.e === 0
        && this.f === 0);
  };

  /**
   * Multiply this matrix by another
   * @param  {benri.geometry.Matrix2D} pThat The matrix to multiply by.
   */
  Matrix2D.prototype.multiply = function(pThat) {

    var tThisA = this.a;
    var tThisB = this.b;
    var tThisC = this.c;
    var tThisD = this.d;
    var tThisE = this.e;
    var tThisF = this.f;

    var tThatA = pThat.a;
    var tThatB = pThat.b;
    var tThatC = pThat.c;
    var tThatD = pThat.d;
    var tThatE = pThat.e;
    var tThatF = pThat.f;

    this.a = tThisA * tThatA + tThisC * tThatB;
    this.b = tThisB * tThatA + tThisD * tThatB;
    this.c = tThisA * tThatC + tThisC * tThatD;
    this.d = tThisB * tThatC + tThisD * tThatD;
    this.e = tThisA * tThatE + tThisC * tThatF + tThisE;
    this.f = tThisB * tThatE + tThisD * tThatF + tThisF;

    this.transforms = null;

    return this;
  };

  /**
   * Gets the rotation of this matrix in degrees if possible.
   * @return {number} The rotation in degrees.
   */
  Matrix2D.prototype.getRotationInDegrees = function() {
    // 180 / Math.PI
    return Math.round(this.getRotation() * 57.29577951308232);
  };

  Matrix2D.prototype.getRotation = function() {
    if (this.transforms !== null) {
      return this.transforms.rotation;
    }

    var tXScale = this.getScaleX();
    var tYScale = this.getScaleY();
    var tA, tB, tC, tD;

    if (tXScale === 0) {
      tA = this.a;
      tC = this.c;
    } else {
      tA = this.a / tXScale;
      tC = this.c / tXScale;
    }

    if (tYScale === 0) {
      tB = this.b;
      tD = this.d;
    } else {
      tB = this.b / tYScale;
      tD = this.d / tYScale;
    }

    var tCos, tTan;

    if (tD !== 0) {
      tCos = tD;
      tTan = tB / tCos;
    } else if (tA !== 0) {
      tCos = tA;
      tTan = -tC / tCos;
    } else {
      return 0;
    }

    if (tCos < 0) {
      return Math.PI - Math.atan(tTan); // Math.PI
    } else if (this.c < 0) {
      return Math.PI * 2 - Math.atan(tTan); // Math.PI*2
    } else {
      return -Math.atan(tTan);
    }
  };

  /**
   * Gets the X scale of this matrix.
   * @return {number} The X scale.
   */
  Matrix2D.prototype.getScaleX = function() {
    if (this.transforms !== null) {
      return this.transforms.scaleX;
    }

    var tA = this.a;
    var tC = this.c;
    var tSign = tA < 0 ? -1 : 1;

    return tSign * (Math.sqrt(Math.pow(tA, 2) + Math.pow(tC, 2)));
  };

  /**
   * Gets the Y scale of this matrix.
   * @return {number} The Y scale.
   */
  Matrix2D.prototype.getScaleY = function() {
    if (this.transforms !== null) {
      return this.transforms.scaleY;
    }

    var tB = this.b;
    var tD = this.d;
    var tSign = tD < 0 ? -1 : 1;

    return tSign * (Math.sqrt(Math.pow(tB, 2) + Math.pow(tD, 2)));
  };

  /**
   * Gets the determinant of this matrix
   */
  Matrix2D.prototype.getDeterminant = function() {
    return this.a * this.d - this.b * this.c;
  };

  /**
   * Invert this matrix
   */
  Matrix2D.prototype.invert = function() {
    var tThisA = this.a;
    var tThisB = this.b;
    var tThisC = this.c;
    var tThisD = this.d;
    var tThisE = this.e;
    var tThisF = this.f;
    var tDeterminant = this.getDeterminant();

    if (tDeterminant !== 0) {
      var tOneOverDeterminant = 1 / tDeterminant;

      this.a = tThisD * tOneOverDeterminant;
      this.b = -tThisB * tOneOverDeterminant;
      this.c = -tThisC * tOneOverDeterminant;
      this.d = tThisA * tOneOverDeterminant;

      this.e = -(tThisE * this.a + tThisF * this.c);
      this.f = -(tThisE * this.b + tThisF * this.d);
    } else {
      // Attempt to reconstruct the inverse manually
      this._syncTransforms();

      var tTransforms = this.transforms;
      var tAngle = Math.PI * 2 - tTransforms.rotation;

      this.a = 1 / tTransforms.scaleX;
      this.b = 0;
      this.c = 0;
      this.d = 1 / tTransforms.scaleY;

      this.e = -tThisE;
      this.f = -tThisF;

      this.multiply({
        a: Math.cos(tAngle),
        b: -Math.sin(tAngle),
        c: Math.sin(tAngle),
        d: Math.cos(tAngle),
        e: 0,
        f: 0
      });
    }

    return this;
  };

  Matrix2D.prototype.getDifference = function(pMatrix) {
    return this.clone().multiply(pMatrix.cloneAndAutoRelease().invert());
  };

  /**
   * Translate this matrix.
   * @param  {number} pX The X amount to translate
   * @param  {number} pY The Y amount to translate
   */
  Matrix2D.prototype.translate = function(pX, pY) {
    var tTransforms = this._syncTransforms();

    this.multiply({
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: pX,
      f: pY
    });

    this.transforms = tTransforms;

    return this;
  };

  Matrix2D.prototype.setX = function(pX) {
    this.e = pX;
  }

  Matrix2D.prototype.setY = function(pY) {
    this.f = pY;
  }

  Matrix2D.prototype.getX = function() {
    return this.e;
  }

  Matrix2D.prototype.getY = function() {
    return this.f;
  }

  /**
   * Rotates this matrix by the given angle in degrees.
   * @param  {number} pDegrees The angle in degrees.
   */
  Matrix2D.prototype.rotateInDegrees = function(pDegrees) {
    // Math.PI / 180;
    return this.rotate(pDegrees * 0.017453292519943295);
  };

  /**
   * Rotates this matrix by the given angle in radians.
   * @param  {number} pAngle The angle in radians.
   */
  Matrix2D.prototype.rotate = function(pAngle) {
    var tTransforms = this._syncTransforms();

    this.multiply({
      a: Math.cos(pAngle),
      b: -Math.sin(pAngle),
      c: Math.sin(pAngle),
      d: Math.cos(pAngle),
      e: 0,
      f: 0
    });

    tTransforms.rotation += pAngle;

    this.transforms = tTransforms;

    return this;
  };

  Matrix2D.prototype.setRotation = function(pAngle) {
    var tTransforms = this._syncTransforms();

    tTransforms.rotation = pAngle;

    tTransforms.apply(this);

    return this;
  };

  Matrix2D.prototype.setRotationInDegrees = function(pDegrees) {
    return this.setRotation(pDegrees * 0.017453292519943295);
  };

  /**
   * Scales this matrix
   * @param  {number} pX The X factor
   * @param  {number} pY The Y factor
   */
  Matrix2D.prototype.scale = function(pX, pY) {
    var tTransforms = this._syncTransforms();

    this.multiply({
      a: pX,
      b: 0,
      c: 0,
      d: pY,
      e: 0,
      f: 0
    });

    tTransforms.scaleX *= pX;
    tTransforms.scaleY *= pY;

    this.transforms = tTransforms;

    return this;
  };

  Matrix2D.prototype.setScaleX = function(pValue) {
    var tTransforms = this._syncTransforms();

    tTransforms.scaleX = pValue;

    tTransforms.apply(this);

    return this;
  };

  Matrix2D.prototype.setScaleY = function(pValue) {
    var tTransforms = this._syncTransforms();

    tTransforms.scaleY = pValue;

    tTransforms.apply(this);

    return this;
  };

  /**
   * Skews this matrix
   * @param  {number} pX The X factor
   * @param  {number} pY The Y factor
   */
  Matrix2D.prototype.skew = function(pX, pY) {
    this.multiply({
      a: 1,
      b: pY,
      c: pX,
      d: 1,
      e: 0,
      f: 0
    });

    return this;
  };

  /**
   * Given X and Y values, return a Point that
   * is transformed according to this matrix.
   * @param  {number} pX The X value
   * @param  {number} pY The Y value
   * @return {benri.geometry.Point} The resulting Point.
   */
  Matrix2D.prototype.getPoint = function(pX, pY) {
    return new Point(
      pX * this.a + pY * this.c + this.e,
      pY * this.d + pX * this.b + this.f
    );
  };

  Matrix2D.prototype.transformVector = function(pVector) {
    var tA = pVector[0];
    var tB = pVector[1];

    pVector[0] = tA * this.a + tB * this.c + this.e;
    pVector[1] = tB * this.d + tA * this.b + this.f;

    return pVector;
  };

  Matrix2D.prototype.transformVectors = function(pVectors, pInPlace) {
    var tNumOfVectors = pVectors.length;
    var tTransformedVectors;
    var i;
    var tX, tY;
    var tVector;
    var tA = this.a;
    var tB = this.b;
    var tC = this.c;
    var tD = this.d;
    var tE = this.e;
    var tF = this.f;

    if (pInPlace) {
      tTransformedVectors = pVectors;
    } else {
      tTransformedVectors = new Array(tNumOfVectors);
    }

    for (i = 0; i < tNumOfVectors; i++) {
      tVector = pVectors[i];
      tX = tVector[0];
      tY = tVector[1];

      tTransformedVectors[i] = [tX * tA + tY * tC + tE, tY * tD + tX * tB + tF];
    }

    return tTransformedVectors;
  };

  Matrix2D.prototype.transformVectorInArray = function(pArray, pIndex) {
    var tIndexLast = pIndex + 1;
    var tA = pArray[pIndex];
    var tB = pArray[tIndexLast];

    pArray[pIndex] = tA * this.a + tB * this.c + this.e;
    pArray[tIndexLast] = tB * this.d + tA * this.b + this.f;
  };

  /**
   * Get a clone of this matrix.
   * @return {benri.geometry.Matrix2D} The clone.
   */
  Matrix2D.prototype.clone = function() {
    var tMatrix = Matrix2D.obtain();

    tMatrix.a = this.a;
    tMatrix.b = this.b;
    tMatrix.c = this.c;
    tMatrix.d = this.d;
    tMatrix.e = this.e;
    tMatrix.f = this.f;

    return tMatrix;
  };

  /**
   * Get a CSS String representation of this matrix.
   * @return {string} The string.
   */
  Matrix2D.prototype.toCSSString = function() {
    return 'matrix3d(' + this.a + ',' + this.b + ',0,0,' + this.c + ',' + this.d + ',0,0,0,0,1,0,' + this.e + ',' + this.f + ',0,1)';
  };

  if (mInstancePoolEnabled) {

    var mInstancePool = mem.createDefaultInstancePool(Matrix2D, {
      allocNum : 500,
      initInstance : function (pInstance, pArgs) {
        // Initialize the instance
        var tMatrixArray = pArgs[0];
        if (tMatrixArray) {
          pInstance.set(tMatrixArray);
        } else {
          pInstance.reset();
        }
      },
    });

    // Create an AutoReleasePool.
    var mAutoReleasePool = new mem.AutoReleasePool({
      release : function (pObject) {
        mInstancePool.recycle(pObject);
      }
    });

    // Wrap the pool's methods around your type.
    Matrix2D.obtain = function (pMatrixArray) {
      return mInstancePool.obtain([pMatrixArray]);
    };

    Matrix2D.prototype.recycle = function () {
      mInstancePool.recycle(this);
    };

    Matrix2D.obtainAndAutoRelease = function (pMatrixArray) {
      var tInstance = mInstancePool.obtain([pMatrixArray]);
      mAutoReleasePool.schedule(tInstance);
      return tInstance;
    };

    Matrix2D.prototype.cloneAndAutoRelease = function () {
      var tInstance = this.clone();
      mAutoReleasePool.schedule(tInstance);
      return tInstance;
    };

    Matrix2D.releasePendingObjects = function () {
      mAutoReleasePool.release();
    };

  } else {

    // Wrap the pool's methods around your type.
    Matrix2D.obtain = function (pMatrixArray) {
      return new Matrix2D(pMatrixArray);
    };

    Matrix2D.prototype.recycle = function () {
      ;
    };

    Matrix2D.obtainAndAutoRelease = function (pMatrixArray) {
      return new Matrix2D(pMatrixArray);
    };

    Matrix2D.prototype.cloneAndAutoRelease = function () {
      return this.clone();
    };

    Matrix2D.releasePendingObjects = function () {
      ;
    };
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {
  var mHandlers = theatre.crews.swf.ASHandlers;
  var net = benri.net;
  var Matrix2D = benri.geometry.Matrix2D;
  var ColorTransform = theatre.crews.swf.structs.ColorTransform;
  
  var mScaleTolerance = 0.00001;

  // For unit test.
  mHandlers.splitTarget = splitTarget;
  mHandlers.splitFull = splitFull;
  mHandlers.splitFullNoStartColon = splitFullNoStartColon;
  mHandlers.getVariableData = getVariableData;

  function splitTarget(pPath) {
    var tChar = '', tCharCode;
    var tLastCharWasSlash = false;
    var tTarget = '';
    var tPart = '';
    var tRelative = true;
    var tIndex = pPath.length - 1;
    var tMiddleOfWord = false;
    var tSpaceString = '';

    for (; tIndex >= 0; tIndex--) {
      tChar = pPath.charAt(tIndex);

      if (tChar === ':') {
        // Can't have a : when only getting a target
        return {
          target: null,
          relative: true
        };
      } else if (tChar === ' ') {
        if (tMiddleOfWord === true) {
          tSpaceString += ' ';
        }
      } else if (tChar === '/') {
        // Get rid of trailing slashes
        if (tLastCharWasSlash === false) {
          tLastCharWasSlash = true;
          tPart = tChar + tPart;
        }

        tSpaceString = '';
        tMiddleOfWord = false;
      } else {
        // Do toLowerCase()
        tCharCode = tChar.charCodeAt(0);
        if (tCharCode > 0x40 && tCharCode < 0x5B) {
          tChar = String.fromCharCode(tCharCode + 0x20);
        }

        tPart = tChar + tSpaceString + tPart;
        tSpaceString = '';
        tMiddleOfWord = true;
        tLastCharWasSlash = false;
      }
    }

    tChar = tPart.charAt(0);

    if (tChar === '/') {
      tRelative = false;
      tTarget = tPart.substring(1);
    } else if (tChar === '_') {
      if (tPart.substr(1, 7) === 'level0') {
        tRelative = false;
        
        if (tPart.charAt(7) === '/') {
          tTarget = tPart.substring(8);
        } else {
          tTarget = tPart.substring(7);
        }
      } else {
        tRelative = true;
        tTarget = tPart;
      }
    } else {
      tTarget = tPart;
    }

    return {
      target: tTarget,
      relative: tRelative
    };
  }

  function splitFull(pPath) {
    var tChar = '', tCharCode;
    var tDataDone = false;
    var tDoingDataColon = false;
    var tLastCharWasSlash = false;
    var tData = '';
    var tTarget = '';
    var tPart = '';
    var tRelative = true;
    var tColonCount = 0;
    var tIndex = pPath.length - 1;
    var tMiddleOfWord = false;
    var tSpaceString = '';

    for (; tIndex >= 0; tIndex--) {
      tChar = pPath.charAt(tIndex);

      if (tChar === ':') {
        // We ignore all : if data has not been collected yet.
        if (tDoingDataColon === true) {
          tColonCount = tColonCount + 1;

          if (tColonCount > 2) {
            // Can't have more than 2 colons
            // for the data part.
            return {
              target: null,
              data: '',
              relative: true
            };
          }
        } else if (tDataDone === false) {
          tDoingDataColon = true;
          tColonCount = 1;
        } else {
          // Flash Player seems to be doing this...
          // It also makes :length easier..........
          // ya.....
          if (tLastCharWasSlash === false) {
            tLastCharWasSlash = true;
            tPart = '/' + tPart;
          }
        }

        tSpaceString = '';
        tMiddleOfWord = false;

      } else {
        // The data part has been read.
        if (tDoingDataColon === true) {
          tDoingDataColon = false;
          tDataDone = true;
          tData = tPart;
          tPart = '';
        }

        if (tChar === ' ') {
          if (tMiddleOfWord === true) {
            tSpaceString += ' ';
          }
        } else if (tChar === '/') {
          // Get rid of trailing slashes
          if (tLastCharWasSlash === false) {
            tLastCharWasSlash = true;
            tPart = tChar + tPart;
          }

          tSpaceString = '';
          tMiddleOfWord = false;
        } else {
          // Do toLowerCase()
          tCharCode = tChar.charCodeAt(0);
          if (tCharCode > 0x40 && tCharCode < 0x5B) {
            tChar = String.fromCharCode(tCharCode + 0x20);
          }

          tPart = tChar + tSpaceString + tPart;
          tSpaceString = '';
          tMiddleOfWord = true;
          tLastCharWasSlash = false;
        }
      }
    }

    if (tDoingDataColon === true) {
      return {
        target: '',
        data: tPart,
        relative: true
      };
    }

    if (tDataDone === false) {
      tTarget = '';
      tData = tPart;
    } else {
      tChar = tPart.charAt(0);

      if (tChar === '/') {
        tRelative = false;
        tTarget = tPart.substring(1);
      } else if (tChar === '_') {
        if (tPart.substr(1, 7) === 'level0') {
          tRelative = false;
          
          if (tPart.charAt(7) === '/') {
            tTarget = tPart.substring(8);
          } else {
            tTarget = tPart.substring(7);
          }
        } else {
          tRelative = true;
          tTarget = tPart;
        }
      } else {
        tTarget = tPart;
      }
    }

    return {
      target: tTarget,
      data: tData,
      relative: tRelative
    };
  }

  function splitFullNoStartColon(pPath) {
    var tChar = '', tCharCode;
    var tDataDone = false;
    var tDoingDataColon = false;
    var tLastCharWasSlash = false;
    var tData = '';
    var tTarget = '';
    var tPart = '';
    var tRelative = true;
    var tColonCount = 0;
    var tIndex = pPath.length - 1;
    var tMiddleOfWord = false;
    var tSpaceString = '';

    for (; tIndex >= 0; tIndex--) {
      tChar = pPath.charAt(tIndex);

      if (tChar === ':') {
        // We ignore all : if data has not been collected yet.
        if (tDoingDataColon === true) {
          tColonCount = tColonCount + 1;

          if (tColonCount > 2) {
            // Can't have more than 2 colons
            // for the data part.
            return {
              target: null,
              data: '',
              relative: true
            };
          }
        } else if (tDataDone === false) {
          tDoingDataColon = true;
          tColonCount = 1;
        } else {
          // Flash Player seems to be doing this...
          // It also makes :length easier..........
          // ya.....
          if (tLastCharWasSlash === false) {
            tLastCharWasSlash = true;
            tPart = '/' + tPart;
          }
        }

        tSpaceString = '';
        tMiddleOfWord = false;
      } else {
        // The data part has been read.
        if (tDoingDataColon === true) {
          tDoingDataColon = false;
          tDataDone = true;
          tData = tPart;
          tPart = '';
        }

        if (tChar === ' ') {
          if (tMiddleOfWord === true) {
            tSpaceString += ' ';
          }
        } else if (tChar === '/') {
          // Get rid of trailing slashes
          if (tLastCharWasSlash === false) {
            tLastCharWasSlash = true;
            tPart = tChar + tPart;
          }

          tSpaceString = '';
          tMiddleOfWord = false;
        } else {
          // Do toLowerCase()
          tCharCode = tChar.charCodeAt(0);
          if (tCharCode > 0x40 && tCharCode < 0x5B) {
            tChar = String.fromCharCode(tCharCode + 0x20);
          }

          tPart = tChar + tSpaceString + tPart;
          tSpaceString = '';
          tMiddleOfWord = true;
          tLastCharWasSlash = false;
        }
      }
    }

    if (tDoingDataColon === true) {
      // :varname is supposed to not ever work
      // Need a target if : is used.
      return {
        target: null,
        data: '',
        relative: true
      };
    }

    if (tDataDone === false) {
      tTarget = '';
      tData = tPart;
    } else {
      tChar = tPart.charAt(0);

      if (tChar === '/') {
        tRelative = false;
        tTarget = tPart.substring(1);
      } else if (tChar === '_') {
        if (tPart.substr(1, 7) === 'level0') {
          tRelative = false;
          
          if (tPart.charAt(7) === '/') {
            tTarget = tPart.substring(8);
          } else {
            tTarget = tPart.substring(7);
          }
        } else {
          tRelative = true;
          tTarget = tPart;
        }
      } else {
        tTarget = tPart;
      }
    }

    return {
      target: tTarget,
      data: tData,
      relative: tRelative
    };
  }

/*

  // Keep split around as it is the full implementation to parse everything.

  function split(pOriginalPath, pOnlyTarget, pAllowColonAsStart) {
    var tChar = '';
    var tDataDone = false;
    var tDoingDataColon = false;
    var tLastCharWasSlash = false;
    var tData = '';
    var tTarget = '';
    var tPart = '';
    var tRelative = true;
    var tColonCount = 0;
    var pPath = pOriginalPath.toLowerCase();
    var tIndex = pPath.length - 1;

    for (; tIndex >= 0; tIndex--) {
      tChar = pPath.charAt(tIndex);

      if (tChar === ':') {
        if (pOnlyTarget === true) {
          // Can't have a : when only getting a target
          return {
            target: null,
            data: '',
            relative: true
          };
        }

        // We ignore all : if data has not been collected yet.
        if (tDoingDataColon === true) {
          tColonCount = tColonCount + 1;

          if (tColonCount > 2) {
            // Can't have more than 2 colons
            // for the data part.
            return {
              target: null,
              data: '',
              relative: true
            };
          }
        } else if (tDataDone === false) {
          tDoingDataColon = true;
          tColonCount = 1;
        } else {
          // Flash Player seems to be doing this...
          // It also makes :length easier..........
          // ya.....
          if (tLastCharWasSlash === false) {
            tLastCharWasSlash = true;
            tPart = '/' + tPart;
          }
        }
      } else {
        if (tDoingDataColon === true) {
          tDoingDataColon = false;
          tDataDone = true;
          tData = tPart;
          tPart = tChar;

          if (tChar === '/') {
            tLastCharWasSlash = true;
          }
        } else {
          // Get rid of trailing slashes
          if (tChar === '/' && tLastCharWasSlash === false) {
            tLastCharWasSlash = true;
            tPart = tChar + tPart;
          } else if (tChar !== '/') {
            tLastCharWasSlash = false;
            tPart = tChar + tPart;
          }
        }
      }
    }

    if (tDoingDataColon === true) {
      if (pAllowColonAsStart === false) {
        // :varname is supposed to not ever work
        // Need a target if : is used.
        return {
          target: null,
          data: '',
          relative: true
        };
      } else {
        return {
          target: '',
          data: tPart,
          relative: true
        };
      }
    }

    if (pOnlyTarget === false && tDataDone === false) {
      tTarget = '';
      tData = tPart;
    } else {
      tChar = tPart.charAt(0);

      if (tChar === '/') {
        tRelative = false;
        tTarget = tPart.substring(1);
      } else if (tChar === '_') {
        if (tPart.substr(1, 7) === 'level0') {
          tRelative = false;
          
          if (tPart.charAt(7) === '/') {
            tTarget = tPart.substring(8);
          } else {
            tTarget = tPart.substring(7);
          }
        } else {
          tRelative = true;
          tTarget = tPart;
        }
      } else {
        tTarget = tPart;
      }
    }

    return {
      target: tTarget,
      data: tData,
      relative: tRelative
    };
  }
*/

  mHandlers.GetTarget = function GetTarget(pPath, pCurrentTarget) {
    if (pPath === '') {
      return pCurrentTarget;
    } else if (typeof pPath !== 'string') {
      return null;
    }

    var tSplitPath = splitTarget(pPath);
    var tTarget = tSplitPath.target;

    if (tTarget === null) {
      return null;
    }

    var tActor = tSplitPath.relative ? pCurrentTarget.get(tTarget) : pCurrentTarget.player.root.get(tTarget);

    if (tActor === null || tActor === tActor.stage.stageManager) {
      return null;
    }

    return tActor;
  };

  mHandlers.GetTargetAndFrame = function GetTargetAndFrame(pPath, pCurrentTarget) {
    if (!pPath) {
      return null;
    }

    var tSplitPath = splitFull(pPath);
    var tSplitTarget = tSplitPath.target;

    if (tSplitTarget === null) {
      return null;
    }

    var tTarget = tSplitPath.relative ? pCurrentTarget.get(tSplitTarget) : pCurrentTarget.player.root.get(tSplitTarget);

    if (tTarget === null || tTarget.stage.stageManager === tTarget) {
      return null;
    }

    var tSplitData = tSplitPath.data;
    var i, il;
    var tChar;

    if (tSplitData !== '') {
      for (i = 0, il = tSplitData.length; i < il; i++) {
        tChar = tSplitData.charCodeAt(i);

        if (tChar > 57 || tChar < 48) {
          return {
            target: tTarget,
            step: -1,
            label: tSplitData
          }
        }
      }
    }

    return {
      target: tTarget,
      step: Math.max((tSplitData | 0) - 1, 0),
      label: null
    };
  }

  mHandlers.NextFrame = function NextFrame() {
    if (!this.isTargetValid) {
      return;
    }
    this.target.goto(this.target.getCurrentStep() + 1);
  };

  mHandlers.PreviousFrame = function PreviousFrame() {
    if (!this.isTargetValid) {
      return;
    }
    this.target.goto(this.target.getCurrentStep() - 1);
  };

  mHandlers.Play = function Play() {
    if (!this.isTargetValid) {
      return;
    }
    this.target.startNextStep();
  };

  mHandlers.Stop = function Stop() {
    if (!this.isTargetValid) {
      return;
    }
    this.target.stop();
  };

  mHandlers.GoToFrame = function GoToFrame(pFrame) {
    if (!this.isTargetValid || pFrame === void 0) {
      return;
    }

    var tTarget = this.target;
    var tLength = tTarget.getScene().getLength() - 1;

    if (pFrame > tLength) {
      pFrame = tLength;
    }

    tTarget.goto(pFrame) !== false || tTarget.goto(0);
  };

  mHandlers.GoToLabel = function GoToLabel(pLabel) {
    if (this.target === null || pLabel === void 0) {
      return;
    }

    this.target.gotoLabel(pLabel.toLowerCase());
  };

  mHandlers.Trace = function Trace(pMessage) {
    global.console.debug(pMessage);
  };

  mHandlers.Call = function Call(pFrame) {
    if (pFrame === void 0) {
      return;
    }

    var tCurrentTarget = this.target;
    var tData = this.GetTargetAndFrame(pFrame, tCurrentTarget);

    if (tData === null) {
      //console.warn('Target not found for Call: Target="' + pFrame + '"');
      return;
    } else {
      tCurrentTarget = tData.target;
    }

    var tScene = tCurrentTarget.getScene();
    var tStep = tData.step;

    if (tStep === -1) {
      tStep = tScene.getLabel(tData.label.toLowerCase());

      if (tStep !== -1) {
        tScene.doScripts(tStep, tCurrentTarget);
      } else {
        //console.warn('Label in Call() did not exist');
      }
    } else {
      tScene.doScripts(tStep, tCurrentTarget);
    }

    if (this.target.stage === null) {
      this.target = this.root;
      this.isTargetValid = false;
      this.isTargetReachable = false;
    }
  };

  mHandlers.GoToFrame2 = function GoToFrame2(pFrame, pSceneBias, pPlayFlag) {
    var tFrameIsNumber = (typeof pFrame === 'number');

    if (pFrame === void 0
      ||
      (this.isTargetValid === false
        &&
        (!pFrame || tFrameIsNumber || pFrame[0] !== '/'))) {
      return;
    }

    var tCurrentTarget = this.target;
    var tLength;

    if (tFrameIsNumber) {
      tLength = tCurrentTarget.getScene().getLength();

      if (pFrame > tLength) {
        pFrame = tLength;
      }

      tCurrentTarget.goto((pFrame - 1) + pSceneBias) !== false || tCurrentTarget.goto(0);

      if (pPlayFlag === 1) {
        tCurrentTarget.startNextStep();
      } else {
        tCurrentTarget.stop();
      }

      if (this.target.stage === null) {
        this.target = this.root;
        this.isTargetValid = false;
        this.isTargetReachable = false;
      }

      return;
    }

    var tData = this.GetTargetAndFrame(pFrame, tCurrentTarget);

    if (tData === null) {
      //console.warn('Target not found for GoToFrame2: Target="' + pFrame + '"');
      return;
    }

    tCurrentTarget = tData.target;

    if (tData.step === -1) {
      if (tCurrentTarget.gotoLabel(tData.label.toLowerCase()) === false) {  // TODO: Support bias?
        return;
      }

      if (pPlayFlag === 1) {
        tCurrentTarget.startNextStep();
      } else {
        tCurrentTarget.stop();
      }
    } else {
      tLength = tCurrentTarget.getScene().getLength() - 1;
      pFrame = tData.step + pSceneBias;

      if (pFrame > tLength) {
        pFrame = tLength;
      }

      if (tCurrentTarget.goto(pFrame) === false) {
        return;
      }

      if (pPlayFlag === 1) {
        tCurrentTarget.startNextStep();
      } else {
        tCurrentTarget.stop();
      }
    }

    if (this.target.stage === null) {
      this.target = this.root;
      this.isTargetValid = false;
      this.isTargetReachable = false;
    }
  };

  function getVariableData(pName, pCurrentTarget) {
    if (!pName) {
      return null;
    }

    var tSplitPath = splitFullNoStartColon(pName);
    var tSplitTarget = tSplitPath.target;
    var tSplitData = tSplitPath.data;

    if (tSplitTarget === null || tSplitData === '') {
      return null;
    }

    var tTarget = tSplitPath.relative ? pCurrentTarget.get(tSplitTarget) : pCurrentTarget.player.root.get(tSplitTarget);

    if (tTarget === null || tTarget.stage.stageManager === tTarget) {
      return null;
    }

    return {
      target: tTarget,
      name: tSplitData
    };
  };

  mHandlers.SetVariable = function SetVariable(pName, pValue) {
    var tData = getVariableData(pName, this.target);

    if (tData === null) {
      return;
    }

    tData.target.setVariable(tData.name, pValue === void 0 ? null : pValue);
  };

  mHandlers.GetVariable = function GetVariable(pName) {
    var tIsLength = false;
    var tLength = pName.length;

    if (pName.substring(tLength - 7) === ':length') {
      // Ex 1: /test:length
      // Ex 2: test:length
      // Ex 3: /hello:test:length
      // Ex 4: /hello/test:length
      // This is an exception so we need to edit this string...
      var tLengthSplit = splitFullNoStartColon(pName);
      var tLengthTarget = tLengthSplit.target;

      if (tLengthTarget === null) {
        return void 0;
      }

      if (tLengthSplit.data === 'length') {
        // TODO: Do we need to actually check that?
        var tLengthLastSlashIndex = tLengthTarget.lastIndexOf('/');

        if (tLengthLastSlashIndex !== -1) {
          // Convert that slash to a colon since it is
          // actually the variable name we want... Silly flash
          pName = tLengthTarget.substring(0, tLengthLastSlashIndex) + ':' + tLengthTarget.substring(tLengthLastSlashIndex + 1);
        } else {
          if (tLengthSplit.relative) {
            // Relative from the beginning, just parse it later.
            pName = tLengthTarget;
          } else {
            // Restore the absolute path.
            pName = '/:' + tLengthTarget;
          }
        }
      }

      tIsLength = true;
    }

    var tData = getVariableData(pName, this.target);

    if (tData === null) {
      return void 0;
    }

    var tValue = tData.target.getVariable(tData.name);

    if (tIsLength) {
      if (tValue === null || tValue === void 0) {
        return void 0;
      }

      return (tValue + '').length;
    }

    return tValue;
  };

  mHandlers.FSCommand2 = function FSCommand2(pArgs) {
    //console.debug('FSCommand2', pName, pArgs);
    return 0;
  };

  /*
   * A utility function to update the scale of matrix relative to the current value.
   * @param {benri.geometry.Matrix2D} pMatrix The matrix to apply scale to.
   * @param {number} pScale Horizontal scale.
   */
  function applyRelativeScaleX(pMatrix, pScale) {
    var tCurrentScaleX = pMatrix.getScaleX();
    
    if (pScale >= 0 && Math.abs(tCurrentScaleX - pScale) < mScaleTolerance) {
      return false;
    }

    var tSign = tCurrentScaleX < 0 ? -1 : 1;

    var tRotation = pMatrix.getRotation();
    if (pScale < 0 && tRotation != 0){
        pMatrix.setRotation(-tRotation);
    }

    pMatrix.setScaleX(tSign * pScale);

    return true;
  }

  /*
   * A utility function to update the scale of matrix relative to the current value.
   * @param {benri.geometry.Matrix2D} pMatrix The matrix to apply scale to.
   * @param {number} pScale Verticle scale.
   */
  function applyRelativeScaleY(pMatrix, pScale) {
    var tCurrentScaleY = pMatrix.getScaleY();
    
    if (pScale >= 0 && Math.abs(tCurrentScaleY - pScale) < mScaleTolerance) {
      return false;
    }

    var tSign = tCurrentScaleY < 0 ? -1 : 1;

    var tRotation = pMatrix.getRotation();
    if (pScale < 0 && tRotation != 0){
        pMatrix.setRotation(-tRotation);
    }

    pMatrix.setScaleY(tSign * pScale);

    return true;
  }


  /*
   * A utility function to update the rotation of matrix.
   * Certain conversion is needed while mixed with scale operation.
   */
  function setConvertedRotationInDegrees(pTarget, pDegree){
    if (pTarget.position.getScaleX() > 0 && pTarget.position.getScaleY() > 0) {
      pTarget.position.setRotationInDegrees(-pDegree);
    } else if (pTarget.position.getScaleX() > 0) {
      pTarget.position.setRotationInDegrees(pDegree);
    } else if (pTarget.position.getScaleY() > 0) {
      pTarget.position.setRotationInDegrees(pDegree + 180);
    } else {
      pTarget.position.setRotationInDegrees(180 - pDegree);
    }
  }


  /*
   * A utility function to update the rotation of matrix.
   * Certain conversion is needed while mixed with scale operation.
   */
  function getConvertedRotationInDegrees(pTarget){
    var tResult = pTarget.position.getRotationInDegrees() % 360;
    var tSignScaleX = pTarget.position.getScaleX() >= 0 ? 1 : -1;
    var tSignScaleY = pTarget.position.getScaleY() >= 0 ? 1 : -1;

    if (tSignScaleX > 0) {
      if (tResult > 180) {
        tResult -= 360;
      } else if (tResult <= -180) {
        tResult += 360;
      }
    } else {
      tResult = tResult >= 0 ? (180 - tResult) : (-180 - tResult);
    }

    if (tSignScaleY > 0) {
      return -tResult;
    } else {
      return tResult;
    }

  }


  mHandlers.SetProperty = function SetProperty(pName, pProperty, pValue) {
    if ((pName === '' && !this.isTargetReachable) || pValue === void 0) {
      // ignore undefined values
      return;
    }

    if (pProperty !== 13 && typeof pValue !== 'number') {
      // Ignore _name for the number check.
      var tChangedValue = this.toFloat(pValue);

      if (tChangedValue + '' !== pValue) {
        // ignore values that are not valid numbers
        return;
      }

      pValue = tChangedValue;
    }

    var tTarget = this.GetTarget(pName, this.target);

    if (tTarget === null) {
      return;
    }

    var tMatrix;
    var tFloat;
    var tColorTransform;
    var tRect;

    switch (pProperty) {
      case 0: // x
        tTarget.invalidationInfo.isPrepareLocked = true;
        tTarget.position.setX(pValue * 20);
        tTarget.invalidate();

        break;
      case 1: // y
        tTarget.invalidationInfo.isPrepareLocked = true;
        tTarget.position.setY(pValue * 20);
        tTarget.invalidate();

        break;
      case 2: // xscale
        if (pValue === '#ERROR#') {
          // FP ignores div-by-zero value.
          break;
        }

        tTarget.invalidationInfo.isPrepareLocked = true;
        if (applyRelativeScaleX(tTarget.position, pValue / 100) === true) {
          tTarget.invalidate();          
        }

        break;
      case 3: // yscale
        if (pValue === '#ERROR#') {
          // FP ignores div-by-zero value.
          break;
        }

        tTarget.invalidationInfo.isPrepareLocked = true;
        if (applyRelativeScaleY(tTarget.position, pValue / 100) === true) {
          tTarget.invalidate();
        }

        break;
      case 4: // currentFrame
        tTarget.goto(this.toInt(pValue) - 1);

        break;
      case 5: // totalFrames
        console.warn('Set Property totalFrames.');

        break;
      case 6: // alpha
        if (pValue < 0) {
          pValue = 0;
        }

        tColorTransform = tTarget.colorTransform;

        if (tColorTransform === null) {
          tColorTransform = tTarget.colorTransform = new ColorTransform();
        }

        tColorTransform.alphaMult = pValue / 100;
        tColorTransform.update();

        tTarget.invalidationInfo.isPrepareLocked = true;
        tTarget.invalidate();

        break;
      case 7: // visible
        var tProp = tTarget.props.render;

        if (tProp.isVisible != pValue) {
          tProp.isVisible = pValue ? true : false;
          tTarget.invalidate();
        }

        break;
      case 8: // width
        tMatrix = tTarget.position;
        tRect = tTarget.props.bounds.getBounds();
        tMatrix.a = (tMatrix.a < 0 ? -1 : 1) * this.toInt(pValue) * 20 / tRect.getPerpendicularWidth();
        tTarget.invalidationInfo.isPrepareLocked = true;
        tTarget.invalidate();
        tRect.recycle();
        break;
      case 9: // height
        tMatrix = tTarget.position;
        tRect = tTarget.props.bounds.getBounds();
        tMatrix.d = (tMatrix.d < 0 ? -1 : 1) * this.toInt(pValue) * 20 / tRect.getPerpendicularHeight();
        tTarget.invalidationInfo.isPrepareLocked = true;
        tTarget.invalidate();
        tRect.recycle();
        break;
      case 10: // rotation
        // Note that:
        //  - the angle specified in ActionScript is clockwise/absolute value.
        //  - the angle returned by Matrix2D.getRotationInDegrees() is counter-clockwise/absolute value.
        //  - the angle taken by Matrix2D.rotateInDegrees() is counter-clockwise/relative value.
        setConvertedRotationInDegrees(tTarget, pValue);
        tTarget.invalidationInfo.isPrepareLocked = true;
        tTarget.invalidate();

        break;
      case 11: // target
        console.warn('Set Property target');

        break;
      case 12: // framesLoaded
        console.warn('Set Property framesLoaded');

        break;
      case 13: // name
        pValue = this.toString(pValue);
        tTarget.name = pValue.toLowerCase();
        tTarget.data.swfName = pValue;

        break;
      case 14: // dropTarget
        console.warn('Set Property dropTarget');
        break;
      case 15: // url
        console.warn('Set Property url');
        break;
      case 16: // highQuality
        console.warn('Set Property highQuality');
        break;
      case 17: // focusRect
        console.warn('Set Property focusRect');
        break;
      case 18: // soundBufTime
        console.warn('Set Property soundBufTime');
        break;
      case 19: // quality
        console.warn('Set Property quality');
        break;
      case 20: // xmouse
        console.warn('Set Property xmouse');
        break;
      case 21: // ymouse
        console.warn('Set Property ymouse');
        break;
      default:
        console.warn('Attempt to get unknown property ' + pProperty + ' on ' + pName);
        break;
    }
  };

  mHandlers.GetProperty = function GetProperty(pName, pProperty) {
    if (pName === '' && !this.isTargetReachable) {
      return void 0;
    }

    var tTarget = this.GetTarget(pName, this.target);

    if (tTarget === null) {
      return void 0;
    }

    var tResult;

    switch (pProperty) {
      case 0: // x
        return tTarget.position.getX() / 20;
      case 1: // y
        return tTarget.position.getY() / 20;
      case 2: // xscale: Always return positive value in Flash Lite 1.1/1.0
        return Math.abs(tTarget.position.getScaleX()) * 100;
      case 3: // yscale: Always return positive value in Flash Lite 1.1/1.0
        return Math.abs(tTarget.position.getScaleY()) * 100;
      case 4: // currentFrame
        return tTarget.getCurrentStep() + 1;
      case 5: // totalFrames
        return tTarget.getScene().getLength();
      case 6: // alpha
        if (tTarget.colorTransform !== null) {
          return ((tTarget.colorTransform.alphaMult) * 100) | 0;
        } else {
          return 100;
        }
      case 7: // visible
        return tTarget.props.render.isVisible === true ? 1 : 0;
      case 8: // width
        var tPlayer = tTarget.player;
        var tBounds = tTarget.props.bounds.getLocalBounds();

        if (!tBounds) {
          return 0;
        }

        tResult = tBounds.getWidth() / 20;
        tBounds.recycle();

        return Math.round(tResult * 100) / 100;
      case 9: // height
        var tPlayer = tTarget.player;
        var tBounds = tTarget.props.bounds.getLocalBounds();

        if (!tBounds) {
          return 0;
        }

        tResult = tBounds.getHeight() / 20;
        tBounds.recycle();

        return Math.round(tResult * 100) / 100;
      case 10: // rotation
        //  The angle returned by Matrix2D.getRotationInDegrees() is counter-clockwise value.
        //  Range: (-180, 180]
        return getConvertedRotationInDegrees(tTarget);
      case 11: // target
        if (tTarget.__isRoot === true) {
          return '/';
        }

        var tNames = [tTarget.data.swfName];
        // TODO: This loop is a hack until we track roots.
        while ((tTarget = tTarget.parent) !== null && !tTarget.__isRoot) {
          tNames.push(tTarget.data.swfName);
        }

        return '/' + tNames.reverse().join('/');
      case 12: // framesLoaded
        return tTarget.getScene().getLength();
      case 13: // name
        return tTarget.data.swfName;
      case 14: // dropTarget
        console.warn('Get property dropTarget encountered.');
        return '';
      case 15: // url
        return tTarget.player.loader.url ? tTarget.player.loader.url.toString() : '';
      case 16: // highQuality
        return 1;
      case 17: // focusRect
        //console.warn('Get property focusRect encountered.');
        return '';
      case 18: // soundBufTime
        console.warn('Get property soundBufTime encountered.');
        return 0;
      case 19: // quality
        //console.warn('Get property quality encountered.');
        return 1;
      case 20: // xmouse
        console.warn('Get property xmouse encountered.');
        return 0;
      case 21: // ymouse
        console.warn('Get property ymouse encountered.');
        return 0;
      default:
        console.warn('Attempt to set unknown property ' + pProperty + ' on ' + pName + ' to ' + pValue);
        return '';
    }
  };

  mHandlers.CloneSprite = function CloneSprite(pNewName, pDepth, pOriginalName) {
    var tOriginal = this.GetTarget(pOriginalName, this.target);

    if (tOriginal === null) {
      //console.warn('Could not find ' + pOriginalName + ' to clone.');
      return;
    }

    var tParent = tOriginal.parent;
    var tNewActor = tOriginal.player.newFromId(tOriginal.displayListId);
    var tOriginalColorTransform = tOriginal.colorTransform;

    if (tOriginalColorTransform !== null) {
      tNewActor.colorTransform = tOriginalColorTransform.clone();
    }

    var tOriginalMatrix = tOriginal.position;
    var tMatrix = tNewActor.position;
    tMatrix.a = tOriginalMatrix.a;
    tMatrix.b = tOriginalMatrix.b;
    tMatrix.c = tOriginalMatrix.c;
    tMatrix.d = tOriginalMatrix.d;
    tMatrix.e = tOriginalMatrix.e;
    tMatrix.f = tOriginalMatrix.f;

    tNewActor.name = pNewName.toLowerCase();
    tNewActor.data.swfName = pNewName;

    var tOldActor = tParent.getActorAtLayer(pDepth);

    if (tOldActor !== null) {
      tOldActor.leave();
    }

    tParent.addActorAtLayer(tNewActor, pDepth);
    tNewActor.invalidate();
  };

  mHandlers.RemoveSprite = function RemoveSprite(pName) {
    var tActor = this.GetTarget(pName, this.target);

    if (tActor === null || tActor.layer <= 0x3FFF) {
      return;
    }

    tActor.leave();

    if (this.target.stage === null) {
      this.target = this.root;
      this.isTargetValid = false;
      this.isTargetReachable = false;
    }
  };

  mHandlers.ToggleQuality = function ToggleQuality() {

  };

  mHandlers.StopSounds = function StopSounds() {
    var tAudioRenderers = this.root.stage.props.audio.context.getAll();
    for (var i = 0, il = tAudioRenderers.length; i < il; i++) {
      tAudioRenderers[i].stop();
    }
  };

  mHandlers.StartDrag = function StartDrag() {

  };

  mHandlers.EndDrag = function EndDrag() {

  };

  mHandlers.WaitForFrame = function WaitForFrame(pWaitCount, pSkipCount) {

  };

  mHandlers.WaitForFrame2 = function WaitForFrame2(pSkipCount) {

  };

  function _trim(pURL) {
    return pURL.replace(/(?:\%20)+$/g, '');
  }

  mHandlers.GetURL = function GetURL(pURL, pTarget) {
    // TODO: How to abstract this for any platform?
    // Intents?

    // The coresponding API calls are:
    //        getURL({URL});
    //        getURL({URL}, {target});

    if (!pURL) {
      // Ignores empty strings.
      return;
    }

    var tURL = new net.URL(pURL);

    // Special case for FSCommand
    if (tURL.scheme.toLowerCase() === 'fscommand') {
      var tPlayer = this.target.player;
      var tPlayerName = tPlayer.getName();
      var tFscommandHandler;

      if (tPlayerName) {
        tFscommandHandler = global[tPlayerName + '_DoFSCommand'];

        if (typeof tFscommandHandler === 'function') {
          tPlayer.stage.onFor('leaveExecute', (function(pHandler, pCommand, pArgs) {
            return function() {
              pHandler(pCommand, pArgs);
            };
          }(tFscommandHandler, tURL.schemeData, pTarget)), 1);
        }
      }

      return;
    }


    var tForm = document.createElement('form');
    tForm.method = 'GET';
    tForm.target = pTarget;

    var tVariables = tURL.query.getAll();

    // Form action is a URL excluding qeury string.
    tURL.query = new net.URLQuery();
    tForm.action = _trim(tURL.toString());

    for (var i = 0, il = tVariables.length; i < il; i++) {
      tElement = document.createElement('input');
      tElement.type = 'hidden';
      tElement.name = tVariables[i].name;
      tElement.value = tVariables[i].value;
      tForm.appendChild(tElement);
    }

    tForm.submit();
  };

  mHandlers.GetURL2 = function GetURL2(pURL, pTarget, pSendVarsMethod, pLoadTargetFlag, pLoadVariablesFlag) {
    if (!pURL) {
      // Ignores empty strings.
      return;
    }

    var tLastValidTarget = this.target,
        tURL = new net.URL(pURL),
        tMethod = 'GET',
        tSelf = this;
        
    var tForm, tOptions, tDelay,
        tVariables, tQuery, k, tElement;

    // The coresponding API calls are:
    //        getURL({URL}, {target});
    //        getURL({URL}, {target}, "GET");
    //        getURL({URL}, {target}, "POST");
    //        loadVariables({URL}, {target});
    //        loadVariables({URL}, {target}, "GET");
    //        loadVariables({URL}, {target}, "POST");
    //        loadMovie({URL}, {target});
    //        loadMovie({URL}, {target}, "GET");
    //        loadMovie({URL}, {target}, "POST");


    if (pSendVarsMethod === 2) {
      tMethod = 'POST';
      tQuery = new net.URLQuery();
    } else {
      // Chrome doesn't deal with query strings correctly.
      tMethod = 'GET';
      tQuery = tURL.query;
      tURL.query = new net.URLQuery();
    }

    if (pSendVarsMethod !== 0) {
      tVariables = tLastValidTarget.getAllVariables();

      for (k in tVariables) {
        tQuery.append(k, tVariables[k]);
      }
    }

    // We don't use Request for getURL({URL}, {target}[, *]);
    if (pLoadTargetFlag === 0 && pLoadVariablesFlag === 0) {
      // TODO: How to make this platform independent?
      // Intents?

      tForm = document.createElement('form');
      tForm.method = tMethod;
      tForm.target = pTarget;

      // Form action is a URL excluding qeury string.
      tForm.action = _trim(tURL.toString());

      var tVariables = tQuery.getAll(), tValue;
      for (var i = 0, il = tVariables.length; i < il; i++) {
        tElement = document.createElement('input');
        tElement.type = 'hidden';
        tElement.name = tVariables[i].name;
        tValue = tElement.value = tVariables[i].value;
        if (i === (il - 1) && typeof tValue === 'string') {
          tElement.value = tValue.trim();
        }
        tForm.appendChild(tElement);
      }

      tForm.submit();

      return;
    }

    tDelay = (new net.Request(tURL, tMethod)).send(null);

    // Process the response.
    tDelay.then(function(pResponse) {
      var tTarget, tVariables;

      if (pLoadTargetFlag) {
        // pTarget is a path to a sprite. The path can be in slash or dot syntax.
        tTarget = tSelf.GetTarget(pTarget, tLastValidTarget);

        if (!tTarget) {
          // TODO: Is this right?
          return;
        }
      } else {
        tTarget = tLastValidTarget.player.root;
      }

      if (pLoadVariablesFlag) {
        // The response is variables
        tVariables = (new net.URLQuery(pResponse.body.text)).getAll();

        for (var i = 0, il = tVariables.length; i < il; i++) {
          tTarget.setVariable(tVariables[i].name, tVariables[i].value);
        }
      } else {
        if (pResponse.body.type === 'application/x-shockwave') {
          // TODO: Merge assets in the SWF file into the target.
          throw new error('Need to load a SWF file');
        }
        // Ignore everything else.
      }
    })
    .or(function(pEvent) {
      // An error occurred. Nop.
      console.log('GetURL2: Request failed', pEvent);
    });

  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Matrix2D = benri.geometry.Matrix2D;
  var Color = benri.graphics.draw.Color;

  theatre.crews.render.Camera = Camera;

  function Camera(pRenderContext) {
    this.context = pRenderContext;
    this.position = Matrix2D.obtain();
    this.projection = Matrix2D.obtain();

    this.backgroundColor = new Color(0, 0, 0, 0);

    this.getMatrix = getMatrix;
  }

  function getMatrix(pModelMatrix) {
    return this.position.clone().multiply(pModelMatrix);
  }

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Matrix2D = benri.geometry.Matrix2D;

  theatre.crews.render.CacheManager = CacheManager;

  function CacheManager(pCamera) {
    this.camera = pCamera;
    this.usageCounterMax = 30;
    this.cooldownMax = 6;

    this._hashToCacheMap = {};
    this._currentCache = null;
    this._currentCacheId = -1;
    this._cooldowns = {};
    this._targetInfo = {
      prevTarget: -1,
      target: -1,
      cameraPosition: null
    };

    this.getCache = getCache;
    this.startCache = startCache;
    this.finishCache = finishCache;
    this.cleanup = cleanup;
    this.isCaching = isCaching;
    this.hasCache = hasCache;
    this.isCachingProp = isCachingProp;

    // Registers the low-memory event handler.
    benri.mem.getDefaultNativeSupervisor().on(
      'lowMem-image',
      createOnLowMemImage(this._hashToCacheMap, this.usageCounterMax)
    );
  }

  function createOnLowMemImage(pMap, pUsageCounterMax) {
    return function() {
      destroyOldCache(pMap, pUsageCounterMax * 0.5);
    };
  }

  function destroyOldCache(pMap, pThreshold) {
    var tCache;

    for (var k in pMap) {
      tCache = pMap[k];

      if (tCache === void 0 || --tCache.usageCounter > pThreshold) {
        continue;
      }

      tCache.destroy();
    }
  }

  function getCache(pHash) {
    var tCache = this._hashToCacheMap[pHash];

    if (tCache !== void 0) {
      tCache.usageCounter = this.usageCounterMax;

      return tCache;
    }

    return void 0;
  }

  function startCache(pCacheProp) {
    if (this._currentCache !== null) {
      // Can only make one cache at a time.
      return false;
    }

    var tHash = pCacheProp.hash;
    var tCoolDown = this._cooldowns[tHash];

    if (tCoolDown !== void 0 && tCoolDown !== 0) {
      return false;
    }

    var tTargetInfo = this._targetInfo;
    var tCamera = this.camera;
    var tMetrics = pCacheProp.getMetrics(tCamera);

    if (tMetrics === null) {
      return false;
    }

    var tWidth = tMetrics.width;
    var tHeight = tMetrics.height;
    var tContext = tCamera.context;
    var tCacheTexture = tContext.createEmptyTexture(tWidth, tHeight);
    var tTargetId = tContext.createTarget(tWidth, tHeight, {
      fragments: [tCacheTexture]
    });

    tTargetInfo.prevTarget = tContext.getTarget();
    tTargetInfo.target = tTargetId;
    tTargetInfo.cameraPosition = tCamera.position;

    tContext.setTarget(tTargetId);

    var tOriginX = tMetrics.originX;
    var tOriginY = tMetrics.originY;
    var tScaleX = tMetrics.scaleX;
    var tScaleY = tMetrics.scaleY;

    var tCameraPosition = tCamera.position = Matrix2D.obtain();
    tCameraPosition.scale(1 / tScaleX, 1 / tScaleY);
    tCameraPosition.translate(-tOriginX, -tOriginY);
    tCameraPosition.multiply(tMetrics.position.cloneAndAutoRelease().invert());

    this._currentCacheId = pCacheProp.actor.id;

    this._currentCache = new Cache(
      this,
      tHash,
      tCacheTexture,
      tOriginX,
      tOriginY,
      tScaleX,
      tScaleY
    );

    return true;
  }

  function finishCache(pCacheProp) {
    var tCache = this._currentCache;

    if (tCache === null || this._currentCacheId !== pCacheProp.actor.id) {
      return null;
    }

    this._currentCache = null;
    this._currentCacheId = -1;

    var tCamera = this.camera;
    var tContext = tCamera.context;
    var tTargetInfo = this._targetInfo;

    tContext.setTarget(tTargetInfo.prevTarget);
    tContext.destroyTarget(tTargetInfo.target);

    tTargetInfo.prevTarget = -1;
    tTargetInfo.target = -1;

    tCamera.position = tTargetInfo.cameraPosition;
    tTargetInfo.cameraPosition = null;

    return tCache;
  }

  function cleanup() {
    destroyOldCache(this._hashToCacheMap, 0);

    var tCooldowns = this._cooldowns;

    for (var k in tCooldowns) {
      if (tCooldowns[k] !== 0) {
        tCooldowns[k]--;
      }
    }
  }

  function isCaching() {
    return this._currentCache !== null;
  }

  function hasCache(pHash) {
    return this._hashToCacheMap[pHash] !== void 0;
  }

  function isCachingProp(pCacheProp) {
    return this._currentCacheId === pCacheProp.actor.id;
  }

  function Cache(pManager, pHash, pTexture, pOriginX, pOriginY, pScaleX, pScaleY) {
    this.manager = pManager;
    this.hash = pHash;
    this.texture = pTexture;
    this.originX = pOriginX;
    this.originY = pOriginY;
    this.scaleX = pScaleX;
    this.scaleY = pScaleY;

    this.usageCounter = pManager.usageCounterMax;

    this.render = cacheRender;
    this.destroy = cacheDestroy;

    pManager._hashToCacheMap[pHash] = this;
  }

  function cacheRender() {
    var tContext = this.manager.camera.context;
    var tMatrix = tContext.matrix;

    tMatrix.translate(this.originX, this.originY);
    tMatrix.scale(this.scaleX, this.scaleY);

    tContext.renderTexture(this.texture);
  }

  function cacheDestroy() {
    var tManager = this.manager;

    tManager._hashToCacheMap[this.hash] = void 0;
    tManager._cooldowns[this.hash] = tManager.cooldownMax;

    this.texture.destroy();

    this.texture = null;
    this.manager = null;
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.event = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  global.benri.event.EventEmitter = EventEmitter;

  var LinkedNode = benri.util.LinkedNode;

  function EventEmitter(pInstance) {
    pInstance = pInstance || this;

    if ('_events' in pInstance) {
      return;
    }

    pInstance._events = {};

    pInstance.on = on;
    pInstance.onFor = onFor;
    pInstance.ignore = ignore;
    pInstance.emit = emit;
  }

  EventEmitter.isEmitter = function(pInstance) {
    return '_events' in pInstance;
  };

  /**
   * Register an event handler for the given event name.
   * @param  {string} pName     The name of the event.
   * @param  {function} pListener The callback handler.
   */
  function on(pName, pListener) {
    var tNode = this._events[pName];

    if (tNode === void 0) {
      tNode = this._events[pName] = new LinkedNode(pListener, null);
    } else {
      while (tNode.next !== null) {
        tNode = tNode.next;
      }

      tNode.add(pListener);
    }
  };

  /**
   * Register an event handler for the given event name.
   * @param  {string} pName     The name of the event.
   * @param  {function} pListener The callback handler.
   * @param {number=0} pCount The number of times to call
   *                        the listener before removing it.
   */
  function onFor(pName, pListener, pCount) {
    this.on(pName, createAutoRemoveListener(pName, pListener, pCount));
  }

  function createAutoRemoveListener(pName, pListener, pCount) {
    return function listener(pData, pTarget) {
      pListener(pData, pTarget);

      if (--pCount <= 0) {
        pTarget.ignore(pName, listener);
      }
    };
  }

  /**
   * Unregister an event handler for the given event name.
   * @param  {string} pName     The name of the event.
   * @param  {function} pListener A previously registered callback handler.
   */
  function ignore(pName, pListener) {
    var tNode = this._events[pName];
    var tHead = tNode;

    if (tNode === void 0) {
      return;
    }

    do {
      if (tNode.data === pListener) {
        tNode.remove();

        if (tNode === tHead) {
          tNode = tNode.next;

          if (tNode === null) {
            this._events[pName] = void 0;
          } else {
            this._events[pName] = tNode;
          }
        }

        return;
      }

      tNode = tNode.next;
    } while (tNode !== null);
  };

  /**
   * Cue this object the event.
   * Execute all handlers registered previously via on.
   * @param  {string} pName The name of the event.
   * @param  {object} pData Data to send with the event.
   */
  function emit(pName, pData) {
    var tNode = this._events[pName];
    var tCallback;

    if (tNode === void 0) {
      return;
    }

    do {
      tCallback = tNode.data;
      tCallback(pData, this);

      tNode = tNode.next;
    } while (tNode !== null);
  };

  EventEmitter.on = on;
  EventEmitter.ignore = ignore;
  EventEmitter.emit = emit;

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var EventEmitter = benri.event.EventEmitter;
  var LinkedNode = benri.util.LinkedNode;
  var releasePendingObjects = benri.geometry.Matrix2D.releasePendingObjects;

  theatre.Stage = Stage;

  /**
   * @private
   */
  function tickCallback(pStage) {
    if (pStage.isOpen === false) {
      return;
    }

    var tTime = Date.now();
    pStage.execute();

    if (pStage.isOpen === true) {
      pStage.timer = setTimeout(tickCallback, pStage.stepRate - (Date.now() - tTime), pStage);
    }
  }

  function Props(pStage) {
    this._stage = pStage;
    this._map = new benri.util.IndexMap(8);

    this.add = _addProp;
    this.get = _getProps;
    this.remove = _removeProp;
  }

  function _addProp(pProp) {
    pProp.id = this._map.add(pProp);

    this[pProp.type] = pProp;

    pProp.onEnter(this._stage);
  }

  function _getProps(pType) {
    var tResult = [];
    var tMap = this._map;

    for (var i = 0, il = tMap.size; i < il; i++) {
      if (tMap[i] && tMap[i].type === pType) {
        tResult.push(tMap[i]);
      }
    }

    return tResult;
  }

  function _removeProp(pProp) {
    this._map.remove(pProp.id);
    pProp.onLeave();
    pProp.id = -1;

    if (this[pProp.type] === pProp) {
      this[pProp.type] = void 0;
    }
  }

  /**
   * RegExp for converting time strings to step indices.
   * @private
   * @type RegExp
   */
  var mTimeToStepRegex = /^([\d]+)(ms|[sm])$/;

  var mStageCounter = 0;

  /**
   * @constructor
   * @name theatre.Stage
   * @param {Object=} pOptions
   */
  function Stage(pOptions) {
    // Private members.

    this.id = ++mStageCounter;

    new EventEmitter(this);

    /**
     * The timer reference set by setTimeout.
     * @private
     * @type number
     */
    this.timer = -1;

    this._scheduledScripts = [];

    // Public members

    /**
     * The rate at which this Stage updates in milliseconds.
     * Default is 30 frames per second.
     * @type number
     * @default 1000/30
     */
    this.stepRate = 1000 / 30;

    /**
     * A flag for if this Stage is currently playing or not.
     * @type boolean
     * @default false
     */
    this.isOpen = false;

    this.inExecute = false;

    this.props = new Props(this);

    this.keyManager = new theatre.KeyManager(this);

    this.pointerManager = new theatre.PointerManager(this);

    this.state = Stage.STATE_IDLING;

    var tStageManager = this.stageManager = new theatre.StageManager();

    tStageManager.layer = 0;
    tStageManager.stage = this;
    tStageManager.stageId = 0;

    var tActors = this._actors = new benri.util.IndexMap(256);

    var tNode = this._actorRegistrationsTail = this._actorRegistrationsHead = new LinkedNode(tStageManager, null);

    tActors.add({
      actor: tStageManager,
      node: tNode,
      data: [
        null, // empty
        {}, // direct
        {}, // bubble
        {}, // direct and bubble
        {}, // child
        {}, // child and direct
        {}, // child and bubble
        {} // child, direct and bubble
      ]
    });

    this._actorInvalidations = new Array(256);

    /**
     * The main cue manager for this Stage.
     * @private
     * @type {theatre.CueManager}
     */
    this._cueManager = new theatre.CueManager(tStageManager.node);

    tStageManager.start();
    tStageManager.invalidate();
  }

  Stage.STATE_IDLING = 1 << 0;
  Stage.STATE_PREPARING = 1 << 1;
  Stage.STATE_ENTERING = 1 << 2;
  Stage.STATE_UPDATING = 1 << 3;
  Stage.STATE_SCRIPTING = 1 << 4;
  Stage.STATE_INVALIDATING = 1 << 5;
  Stage.STATE_LEAVING = 1 << 6;

  /**
   * Converts a given time string to a step index
   * based on the current {@link theatre.Stage#stepRate}.
   * @param {(String|Number)} pTime The index or a time string.
   * @param {Number} pRate The step rate to calculate against.
   * @return {Number} A step index.
   */
  Stage.timeToStep = function timeToStep(pTime, pRate) {
    if (typeof pTime === 'number') {
      return pTime;
    }

    var tResult = mTimeToStepRegex.exec(pTime);
    if (tResult === null) {
      throw new Error('Bad time string');
    }
    switch (tResult[2]) {
      case 'ms':
        return (tResult[1] / pRate) | 0;
      case 's':
        return ((tResult[1] * 1000) / pRate) | 0;
      case 'm':
        return ((tResult[1] * 60 * 1000) / pRate) | 0;
    }

    throw new Error('Bad time string');
  };

  var tProto = Stage.prototype;

  /**
   * Converts a given time string to a step index
   * based on the current {@link theatre.Stage#stepRate}.
   * @param {(string|number)} pTime The index or a time string.
   * @return {number} A step index.
   */
  tProto.timeToStep = function timeToStep(pTime) {
    return Stage.timeToStep(pTime, this.stepRate);
  };

  /**
   * Opens the Stage and starts the play.
   * Actors will start acting.
   * @return theatre.Stage This Stage.
   */
  tProto.open = function open() {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;

    this.execute();

    this.timer = setTimeout(tickCallback, this.stepRate, this);
  };

  /**
   * Closes the Stage and stops the play.
   * All Actors stop acting.
   * @return theatre.Stage This Stage.
   */
  tProto.close = function close() {
    if (!this.isOpen) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = -1;
    this.isOpen = false;
  };

  tProto.registerActor = function registerActor(pActor) {
    var tNode = this._actorRegistrationsTail = this._actorRegistrationsTail.add(pActor);
    var tNextIndex = pActor.stageId = this._actors.add({
      actor: pActor,
      node: tNode,
      data: [
        null, // empty
        {}, // direct
        {}, // bubble
        {}, // direct and bubble
        {}, // child
        {}, // child and direct
        {}, // child and bubble
        {} // child, direct and bubble
      ]
    });

    this._actorInvalidations[tNextIndex] = void 0;
  };

  tProto.unregisterActor = function unregisterActor(pActor) {
    var tStageId = pActor.stageId;
    var tActorInvalidations = this._actorInvalidations;
    var tActorNode = this._actors[tStageId].node;

    pActor.stageId = -1;

    if (tActorNode === this._actorRegistrationsTail) {
      this._actorRegistrationsTail = tActorNode.prev;
    }

    tActorNode.remove();

    this._actors.remove(tStageId);
    
    var tInvalidationNode = tActorInvalidations[tStageId];
    
    if (tInvalidationNode !== void 0) {
      tInvalidationNode.remove();
      tActorInvalidations[tStageId] = void 0;
    }
  };

  var INVALIDATION_TYPE_DIRECT = Stage.INVALIDATION_TYPE_DIRECT = 1 << 0;
  var INVALIDATION_TYPE_BUBBLE = Stage.INVALIDATION_TYPE_BUBBLE = 1 << 1;
  var INVALIDATION_TYPE_CHILD = Stage.INVALIDATION_TYPE_CHILD = 1 << 2;

  var mInvalidationTypeBitMaskMap = [
    [], // empty
    [1, 3, 5, 7], // direct
    [2, 3, 6, 7], // bubble
    [], // empty
    [4, 5, 6, 7] // child
  ];

  function InvalidationInfo(pActor, pType, pReason) {
    this.actor = pActor;
    this.type = pType;
    this.reasons = [pReason];
  }

  /*function deleteInvalidationData(pType, pData) {
    var tMap = mInvalidationTypeBitMaskMap[pType];

    for (var i = 0, il = tMap.length; i < il; i++) {
      pData[tMap[i]] = {};
    }
  }*/

  tProto.invalidateActor = function invalidateActor(pActor, pReason) {
    var tMainActor = pActor;
    var tStageId = pActor.stageId;

    if (tStageId === -1) {
      return;
    }

    var tActors = this._actors;
    var tData = tActors[tStageId].data;
    var tParent;
    var tParentStageId;

    //deleteInvalidationData(INVALIDATION_TYPE_DIRECT, tActors[tStageId].data);
    // Sorry, for speed we are manually inlining this.
    
    tData[1] = {};
    tData[3] = {};
    tData[5] = {};
    tData[7] = {};

    var tActorInvalidations = this._actorInvalidations;
    var tActorInvalidationNode = tActorInvalidations[tStageId];
    var tActorInvalidationNodeData;

    if (tActorInvalidationNode === void 0) {
      // This is the first time we invalidate this Actor.
      var tActorsToInvalidate = [pActor];
      tParent = pActor.parent;

      if (tParent === null) {
        // Basically if this is stage manager so we are done.
        tActorInvalidations[0] = new LinkedNode(
          new InvalidationInfo(pActor, INVALIDATION_TYPE_DIRECT, pReason),
          null
        );

        return;
      }

      while (tParent !== null) {
        // While a parent exists we bubble invalidate parents.
        tParentStageId = tParent.stageId;
        tActorInvalidationNode = tActorInvalidations[tParentStageId];

        if (tActorInvalidationNode !== void 0) {
          // We have already invalidated this. Update the types.
          if ((tActorInvalidationNode.data.type & INVALIDATION_TYPE_BUBBLE) !== 0) {
            // We have already done this type, finish up
            // because all parents must have bubbled too.
            break;
          } else {
            tActorInvalidationNode.data.type |= INVALIDATION_TYPE_BUBBLE;
          }
        } else {
          tActorsToInvalidate.push(tParent);
        }

        //deleteInvalidationData(INVALIDATION_TYPE_BUBBLE, tActors[tParentStageId].data);
        // Sorry, for speed we are manually inlining this.
    
        tData = tActors[tParentStageId].data;
        tData[2] = {};
        tData[3] = {};
        tData[6] = {};
        tData[7] = {};

        tParent = tParent.parent;
      }

      var tIndex = tActorsToInvalidate.length - 1;

      if (tActorInvalidationNode === void 0) {
        // This branch has not yet been invalidated.
        // Pick the first node as the StageManager.
        pActor = tActors[0].actor;
        pActor.invalidationInfo.isInvalidated = true;
        tActorInvalidationNode = tActorInvalidations[0] = new LinkedNode(
          new InvalidationInfo(pActor, INVALIDATION_TYPE_BUBBLE, pReason),
          null
        ); // stage manager
        tIndex--;
      }

      var tNextNode;
      var tNextNodeActor;

      for (; tIndex >= 0; tIndex--) {
        // Note that we overwrite pActor here for performance.
        pActor = tActorsToInvalidate[tIndex];
        pActor.invalidationInfo.isInvalidated = true;
        tParent = pActor.parent;
        tNextNode = tActorInvalidationNode.next;

        // Sort actors with the same parent by layer.
        while (
            tNextNode !== null &&
            (tNextNodeActor = tNextNode.data.actor).parent === tParent &&
            pActor.layer >= tNextNodeActor.layer
          ) {
          tActorInvalidationNode = tNextNode;
          tNextNode = tNextNode.next;
        }

        // Create a new InvalidationInfo object for each
        // invalidated Actor.
        tActorInvalidationNode = tActorInvalidations[pActor.stageId] = tActorInvalidationNode.add(
          new InvalidationInfo(pActor, tIndex === 0 ? INVALIDATION_TYPE_DIRECT : INVALIDATION_TYPE_BUBBLE, pReason)
        );
      }
    } else if ((tActorInvalidationNode.data.type & INVALIDATION_TYPE_DIRECT) === 0) {
      // We've been invalidated before, but not directly.
      tActorInvalidationNode.data.type |= INVALIDATION_TYPE_DIRECT;

      tParent = tMainActor.parent;

      while (tParent !== null) {
        // While a parent exists we bubble invalidate parents.
        tParentStageId = tParent.stageId;
        tActorInvalidationNodeData = tActorInvalidations[tParentStageId].data;

        if ((tActorInvalidationNodeData.type & INVALIDATION_TYPE_BUBBLE) !== 0) {
          break;
        }

        tActorInvalidationNodeData.type |= INVALIDATION_TYPE_BUBBLE;

        //deleteInvalidationData(INVALIDATION_TYPE_BUBBLE, tActors[tParentStageId].data);
        // Sorry, for speed we are manually inlining this.
    
        tData = tActors[tParentStageId].data;
        tData[2] = {};
        tData[3] = {};
        tData[6] = {};
        tData[7] = {};

        tParent = tParent.parent;
      }
    }

    // Invalidate all children.

    var tTargetNode = tMainActor.node;

    if (!tTargetNode.hasChild) {
      return;
    }

    while (true) {
      // This logic is for figuring out what our
      // final target node is for us to stop this
      // loop at. We need this because the TreeNode
      // class is a looping kind of tree that loops
      // on to itself infinitly for performance.
      if (tTargetNode.nextSibling !== null) {
        // The sibling is who we are looking for.
        tTargetNode = tTargetNode.nextSibling;
        break;
      }

      tParent = tTargetNode.actor.parent;

      if (tParent === null) {
        // No more actors to check, invalidate
        // everybody else remaining in the list.
        break;
      }

      tTargetNode = tParent.node;
    }

    var tTraversalNode = tMainActor.node.next;
    var tInvalidationInfo;

    // A note.
    // tActorInvalidationNode at this point is the directly
    // invalidated Actor. ie, tMainActor.

    // Loop until we find the last (target) node.
    // ie the last child.
    while (tTraversalNode !== tTargetNode) {
      // Once again, use pActor for performance.
      pActor = tTraversalNode.actor;
      tStageId = pActor.stageId;
      tInvalidationInfo = tActorInvalidations[tStageId];

      while (
          tInvalidationInfo !== void 0 &&
          ((tInvalidationInfo.data.type & (INVALIDATION_TYPE_DIRECT | INVALIDATION_TYPE_CHILD)) !== 0)
        ) {
        // Skip actors that have already been invalidated
        // directly or via child.
        if (tTraversalNode.nextSibling !== null) {
          // Move to the next sibling.
          tTraversalNode = tTraversalNode.nextSibling;
          pActor = tTraversalNode.actor;
          tStageId = pActor.stageId;
          tInvalidationInfo = tActorInvalidations[tStageId];

          // pActor is directly invalidated.
          // This means that we can assume that
          // tTraversalNode.prev is also invalidated
          // and is the node to add ourselves to for
          // child invalidation nodes.
          tActorInvalidationNode = tActorInvalidations[tTraversalNode.prev.actor.stageId];

          continue;
        }

        // At this point pActor is the last
        // sibling of a parent.

        tParent = tTraversalNode.actor.parent;

        if (tParent === tMainActor || tParent === null) {
          // We have finished looking for children.
          return;
        }

        tTraversalNode = tParent.node;

        if (tTraversalNode === tTargetNode) {
          // We have finished looking for children.
          return;
        }
      }

      //deleteInvalidationData(INVALIDATION_TYPE_CHILD, tActors[tStageId].data);
      // Sorry, for speed we are manually inlining this.
    
      tData = tActors[tStageId].data;
      tData[4] = {};
      tData[5] = {};
      tData[6] = {};
      tData[7] = {};

      if (tInvalidationInfo === void 0) {
        // This Actor has not been invalidated before.
        pActor.invalidationInfo.isInvalidated = true;
        tActorInvalidationNode = tActorInvalidations[tStageId] = tActorInvalidationNode.add(
          new InvalidationInfo(pActor, INVALIDATION_TYPE_CHILD, pReason)
        );
      } else {
        // The Actor has been invalidatd,
        // but we need to update the type if needed.
        // TODO: Is this possible now?
        tActorInvalidationNode = tActorInvalidations[tStageId];
        tActorInvalidationNode.data.type |= INVALIDATION_TYPE_CHILD;
      }

      tTraversalNode = tTraversalNode.next;
    } while (tTraversalNode !== tTargetNode);
  };

  /**
   * Adds an Actor to this Stage's StageManager.
   * @param {theatre.Actor} pActor The Actor to add.
   * @param {number=} pLayer The layer to add to.
   * @return {theatre.Actor} The new Actor.
   */
  tProto.addActor = function addActor(pActor) {
    return this.stageManager.addActor(pActor);
  };

  tProto.setActorStageData = function setActorStageData(pActor, pType, pName, pData) {
    this._actors[pActor.stageId].data[pType][pName] = pData;
  };

  tProto.getActorStageData = function getActorStageData(pActor, pType, pName) {
    return this._actors[pActor.stageId].data[pType][pName];
  };

  /**
   * Schedules a script to be run.
   * @param {function} pScript
   */
  tProto.scheduleScripts = function scheduleScripts(pScene, pStep, pActor) {
    this._scheduledScripts.push({
      scene: pScene,
      step: pStep,
      actor: pActor
    });
  };
  
  /**
   * @private
   */
  tProto.doScheduledScripts = function doScheduledScripts() {
    var tStageScripts = this._scheduledScripts;
    var tLength = tStageScripts.length;
    var tScripts;
    var tScript;
    var tActor;
    var i;

    while (tLength !== 0) {
      tScripts = tStageScripts.splice(0, tLength);

      for (i = 0; i < tLength; i++) {
        tScript = tScripts[i];
        tActor = tScript.actor;

        if (tActor.stage !== null) {
          tScript.scene.doScripts(tScript.step, tScript.actor);
        }
      }

      tLength = tStageScripts.length;
    }
  };

  /**
   * @private
   */
  tProto.execute = function execute() {
    this.inExecute = true;

    // Run all prepared scripts from top down first to last.
    this.state = Stage.STATE_PREPARING;

    var tActor;
    var tCurrentNode = this._actorRegistrationsTail;
    
    do {
      tActor = tCurrentNode.data;

      if (tActor.isActing === true) {
        tActor._step(1);
        tActor.emit('prepare');
      }
    } while((tCurrentNode = tCurrentNode.prev) !== null);

    tCurrentNode = null;
    tActor = null;

    this.emit('prepare', null);

    // Run all enterstep handlers from top down first to last.
    //this.state = Stage.STATE_ENTERING;
    //this.broadcast('enterstep', null, false, false);

    // Run all update handlers from bottom up last to first.
    //this.state = Stage.STATE_UPDATING;
    //this.broadcast('update', null, true, true);

    this.state = Stage.STATE_SCRIPTING;
    this.doScheduledScripts();

    this.state = Stage.STATE_LEAVING;
    this.emit('leavestep', null);


    this.doInvalidations();

    this.emit('leaveExecute', null);

    this.state = Stage.STATE_IDLING;

    releasePendingObjects();

    this.inExecute = false;
  };

  tProto.doInvalidations = function doInvalidations() {
    this.state = Stage.STATE_INVALIDATING;

    var tActor;
    var tActorInvalidations = this._actorInvalidations;
    var tInvalidationInfo;
    var tCurrentNode = tActorInvalidations[0];

    if (tCurrentNode !== void 0) {
      do {
        tInvalidationInfo = tCurrentNode.data;
        tActor = tInvalidationInfo.actor;

        tActor.emit('invalidate', tInvalidationInfo);
        tActor.invalidationInfo.isDirectlyInvalidated = tActor.invalidationInfo.isInvalidated = false;

        tActorInvalidations[tActor.stageId] = void 0;
      } while ((tCurrentNode = tCurrentNode.next) !== null);

      this.emit('revalidated', null);
    }



    this.state = Stage.STATE_IDLING;
  };

  /**
   * Sends a broadcast cue to all listeners for that cue.
   * @param {string} pName The type of cue.
   * @param {Object=} pData Data to send with the cue if any.
   * @param {bool=false} pBottomUp Process bottom up if true, top down if false.
   * @param {bool=false} pLastToFirst Process siblings last to first if true.
   *                                  Last to first if false.
   */
  tProto.broadcast = function broadcast(pName, pData, pBottomUp, pLastToFirst) {
    if (!pBottomUp) {
      this.emit(pName, pData);
    }

    this._cueManager.broadcast(pName, pData, pBottomUp, pLastToFirst);

    if (pBottomUp) {
      this.emit(pName, pData);
    }
  };

  tProto.constructor = Stage;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var MorphShapeBoundsProp = (function(pSuper) {
    var Rect = benri.geometry.Rect;
    var ABS_BOUNDS_MASK = theatre.Stage.INVALIDATION_TYPE_DIRECT | 
                          theatre.Stage.INVALIDATION_TYPE_BUBBLE | 
                          theatre.Stage.INVALIDATION_TYPE_CHILD;

    /**
     * @constructor
     * @param {[type]} pStartBounds
     * @param {[type]} pEndBounds
     */
    function MorphShapeBoundsProp(pStartBounds, pEndBounds) {
      pSuper.call(this);
      
      this.type = 'bounds';

      var tStartOriginX = this.startOriginX = pStartBounds.left;
      var tStartOriginY = this.startOriginY = pStartBounds.top;
      this.startWidth = Math.abs(pStartBounds.right - tStartOriginX);
      this.startHeight = Math.abs(pStartBounds.bottom - tStartOriginY);

      var tEndOriginX = this.endOriginX = pEndBounds.left;
      var tEndOriginY = this.endOriginY = pEndBounds.top;
      this.endWidth = Math.abs(pEndBounds.right - tEndOriginX);
      this.endHeight = Math.abs(pEndBounds.bottom - tEndOriginY);
    }
  
    var tProto = MorphShapeBoundsProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = MorphShapeBoundsProp;
  
    tProto.getBounds = function getBounds() {
      var tActor = this.actor;
      var tRatio = tActor.ratio;

      var tStartOriginX = this.startOriginX;
      var tStartOriginY = this.startOriginY;
      var tStartWidth = this.startWidth;
      var tStartHeight = this.startHeight;

      var tRect = new Rect();

      tRect.init(
        tStartOriginX + (this.endOriginX - tStartOriginX) * tRatio,
        tStartOriginY + (this.endOriginY - tStartOriginY) * tRatio,
        tStartWidth + (this.endWidth - tStartWidth) * tRatio,
        tStartHeight + (this.endHeight - tStartHeight) * tRatio
      );

      return tRect;
    };

    tProto.getLocalBounds = function getLocalBounds() {
      return this.getBounds().transform(tActor.position);
    };

    tProto.getAbsoluteBounds = function getAbsoluteBounds() {
      var tActor = this.actor;
      var tStage = tActor.stage;

      if (tStage === null) {
        return null;
      }

      var tRect = tStage.getActorStageData(tActor, ABS_BOUNDS_MASK, 'bounds');

      if (tRect !== void 0) {
        if (tRect === null) {
          return null;
        }
        
        return tRect;
      }

      var tRatio = tActor.ratio;

      var tStartOriginX = this.startOriginX;
      var tStartOriginY = this.startOriginY;
      var tStartWidth = this.startWidth;
      var tStartHeight = this.startHeight;

      var tRect = new Rect();
      
      tRect.init(
        tStartOriginX + (this.endOriginX - tStartOriginX) * tRatio,
        tStartOriginY + (this.endOriginY - tStartOriginY) * tRatio,
        tStartWidth + (this.endWidth - tStartWidth) * tRatio,
        tStartHeight + (this.endHeight - tStartHeight) * tRatio
      );

      tRect.transform(tActor.getAbsolutePosition());

      tStage.setActorStageData(tActor, ABS_BOUNDS_MASK, 'bounds', tRect);

      return tRect;
    };

    return MorphShapeBoundsProp;
  })(theatre.Prop);

  theatre.crews.swf.props.MorphShapeBoundsProp = MorphShapeBoundsProp;

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var CacheProp = (function(pSuper) {
    var INVALIDATION_TYPE_MASK =  theatre.Stage.INVALIDATION_TYPE_DIRECT |
                                    theatre.Stage.INVALIDATION_TYPE_CHILD;

    /**
     * @constructor
     */
    function CacheProp(pBaseHash, pInvalidationRatio) {
      pSuper.call(this);
      
      this.type = 'renderCache';

      this.baseHash = pBaseHash;

      this.hash = pBaseHash;

      this.invalidationRatio = pInvalidationRatio;

      this._sizeDirty = false;
    }
  
    var tProto = CacheProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = CacheProp;

    tProto.updateHash = function updateHash(pHash) {
      this.hash = this.baseHash + pHash;
    };

    function onInvalidate(pData, pTarget) {
      var tProp = pTarget.props.renderCache;

      if ((pData.type & INVALIDATION_TYPE_MASK) !== 0) {
        tProp._sizeDirty = true;
      }
    }
  
    var superOnAdd = pSuper.prototype.onAdd;

    tProto.onAdd = function onAdd(pActor) {
      superOnAdd.call(this, pActor);

      pActor.on('invalidate', onInvalidate);
    };

    var superRemove = pSuper.prototype.onRemove;

    tProto.onRemove = function() {
      pActor.ignore('invalidate', onInvalidate);

      superRemove.call(this);
    };

    /**
     * Returns if the Actor this Prop is attached to
     * is cachable or not.
     * 
     * @return {boolean}
     */
    tProto.isCachable = function(pRenderManagerProp) {
      return true;
    };

    /**
     * Returns if any cache that might have been
     * created by this Prop is invalid or not.
     * 
     * @return {boolean}
     */
    tProto.isInvalid = function(pRenderManagerProp, pCache) {
      if (this._sizeDirty === true) {
        this._sizeDirty = false;

        var tAbsoluteBounds = this.actor.props.bounds.getAbsoluteBounds();
        
        if (tAbsoluteBounds === null) {
          return true;
        }

        tAbsoluteBounds = tAbsoluteBounds.clone().transform(pRenderManagerProp.camera.position);

        var tTextureWidth = pCache.texture.getWidth();
        var tTextureHeight = pCache.texture.getHeight();

        if (
            (tAbsoluteBounds.getWidth() > (tTextureWidth + tTextureWidth * this.invalidationRatio) ||
            tAbsoluteBounds.getHeight() > (tTextureHeight + tTextureHeight * this.invalidationRatio))
          ) {
          tAbsoluteBounds.recycle();

          return true;
        }

        tAbsoluteBounds.recycle();
      }

      return false;
    };

    /**
     * Get the metrics to create cache for
     * this Prop's Actor.
     *
     * This function will <b>always</b> be
     * called right after isCachable in succession.
     * 
     * @return {Object}
     */
    tProto.getMetrics = function(pCamera) {
      var tActor = this.actor;
      var tActorBounds = tActor.props.bounds;
      var tAbsoluteBounds;
      var tLocalBounds;
      var tWidth, tHeight;
      var tContext;

      tAbsoluteBounds = tActorBounds.getAbsoluteBounds();

      if (tAbsoluteBounds === null) {
        return null;
      }

      tContext = pCamera.context;
      tAbsoluteBounds = tAbsoluteBounds.clone().transform(pCamera.position);
        
      tWidth = tAbsoluteBounds.getWidth();

      if (
          (tWidth === 0 || tWidth > tContext.width * 1.2) ||
          ((tHeight = tAbsoluteBounds.getHeight()) === 0 || tHeight > tContext.height * 1.2)
        ) {
        // Performance sucks for textures larger than what we
        // can handle. The size of the RenderContext is a good
        // hint to use.
        tAbsoluteBounds.recycle();

        return null;
      }

      tAbsoluteBounds.recycle();

      tLocalBounds = tActorBounds.getBounds();

      this._sizeDirty = false;

      return {
        originX: tLocalBounds.originX,
        originY: tLocalBounds.originY,
        width: tWidth,
        height: tHeight,
        scaleX: 1 / (tWidth / tLocalBounds.getWidth()),
        scaleY: 1 / (tHeight / tLocalBounds.getHeight()),
        position: tActor.getAbsolutePosition()
      };
    };

    return CacheProp;
  })(theatre.Prop);

  theatre.crews.render.CacheProp = CacheProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.crews.render.CacheProp}
   */
  var ShapeCacheProp = (function(pSuper) {
    /**
     * @constructor
     */
    function ShapeCacheProp(pBaseHash, pRenderData, pInvalidationRatio) {
      pSuper.call(this, pBaseHash, pInvalidationRatio);

      this.renderData = pRenderData;
    }
  
    var tProto = ShapeCacheProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = ShapeCacheProp;

    tProto.isCachable = function(pRenderManagerProp) {
      if (this.actor.clipDepth > 0) {
        return false;
      }
      
      return true;
    };

    var superIsInvalid = pSuper.prototype.isInvalid;

    tProto.isInvalid = function(pRenderManagerProp, pCache) {
      if (this.actor.clipDepth > 0) {
        return true;
      }

      var tRenderData = this.renderData;

      if (tRenderData.numOfBitmaps === 1 && tRenderData.paths.length === 1) {
        var tAbsoluteBounds = this.actor.props.bounds.getAbsoluteBounds();

        if (tAbsoluteBounds === null) {
          return true;
        }

        tAbsoluteBounds = tAbsoluteBounds.clone().transform(pRenderManagerProp.camera.position);

        var tWidth = tAbsoluteBounds.getWidth();
        var tHeight = tAbsoluteBounds.getHeight();
        var tTextureWidth = pCache.texture.getWidth();
        var tTextureHeight = pCache.texture.getHeight();

        if (
            (tWidth > (tTextureWidth + tTextureWidth * this.invalidationRatio) &&
             tTextureWidth < tRenderData.bitmapWidth ) ||
            (tHeight > (tTextureHeight + tTextureHeight * this.invalidationRatio) &&
            tTextureHeight < tRenderData.bitmapHeight) 
          ) {

          tAbsoluteBounds.recycle();

          return true;
        }

        tAbsoluteBounds.recycle();

        return false;
      }

      return superIsInvalid.call(this, pRenderManagerProp, pCache);
    };

    var superGetMetrics = pSuper.prototype.getMetrics;

    tProto.getMetrics = function(pCamera) {
      var tMetrics = superGetMetrics.call(this, pCamera);

      if (tMetrics === null) {
        return null;
      }

      var tRenderData = this.renderData;
      var tWidth, tHeight;

      if (tRenderData.numOfBitmaps === 1 && tRenderData.paths.length === 1) {
        var tLocalBounds = this.actor.props.bounds.getBounds();

        tWidth = Math.min(tRenderData.bitmapWidth, tMetrics.width);
        tHeight = Math.min(tRenderData.bitmapHeight, tMetrics.height);

        tMetrics.scaleX = 1 / (tWidth / tLocalBounds.getWidth());
        tMetrics.scaleY = 1 / (tHeight / tLocalBounds.getHeight());
        tMetrics.width = tWidth;
        tMetrics.height = tHeight;
      }

      // TODO: Support shapeResize?

      return tMetrics;
    };

    return ShapeCacheProp;
  })(theatre.crews.render.CacheProp);

  theatre.crews.swf.props.ShapeCacheProp = ShapeCacheProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.crews.render.CachableProp}
   */
  var ContainerCacheProp = (function(pSuper) {
    var INVALIDATION_TYPE_BUBBLE = theatre.Stage.INVALIDATION_TYPE_BUBBLE;

    /**
     * @constructor
     */
    function ContainerCacheProp(pBaseHash, pInvalidationRatio) {
      pSuper.call(this, pBaseHash, pInvalidationRatio);

      this._isInvalid = false;
      this._noCachableChildren = false;
      this._isCachable = {};
    }
  
    var tProto = ContainerCacheProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = ContainerCacheProp;

    function onInvalidate(pData, pTarget) {
      var tProp = pTarget.props.renderCache;

      if ((pData.type & INVALIDATION_TYPE_BUBBLE) !== 0) {
        // Invalidate the cache when our children have been invalidated.
        tProp._isInvalid = true;
        tProp._isCachable = {};

        var tNode = tProp.actor.node;

        if (tNode.hasChild === false || tNode.next.nextSibling === null) {
          // Don't cache containers that have no children.
          tProp._noCachableChildren = true;
        } else {
          tProp._noCachableChildren = false;
        }
      }
    }
  
    var superOnAdd = pSuper.prototype.onAdd;

    tProto.onAdd = function onAdd(pActor) {
      superOnAdd.call(this, pActor);

      pActor.on('invalidate', onInvalidate);

      var tNode = pActor.node;

      if (tNode.hasChild === false || tNode.next.nextSibling === null) {
        // Don't cache containers that have no children.
        this._noCachableChildren = true;
      } else {
        this._noCachableChildren = false;
      }
    };

    var superRemove = pSuper.prototype.onRemove;

    tProto.onRemove = function() {
      pActor.ignore('invalidate', onInvalidate);

      superRemove.call(this);
    };

    tProto.isCachable = function(pRenderManagerProp) {
      var tHash = this.hash;
      var tIsCachable = this._isCachable;

      if (tIsCachable[tHash] === void 0) {
        tIsCachable[tHash] = true;

        return false;
      }

      if (this._noCachableChildren === true) {
        return false;
      }

      this._isInvalid = false;

      return true;
    };

    var superIsInvalid = pSuper.prototype.isInvalid;

    tProto.isInvalid = function(pRenderManagerProp, pCache) {
      var tIsInvalid = this._isInvalid;

      this._isInvalid = false;

      if (tIsInvalid === false) {
        return superIsInvalid.call(this, pRenderManagerProp, pCache);
      }

      return tIsInvalid;
    };
  
    return ContainerCacheProp;
  })(theatre.crews.render.CacheProp);

  theatre.crews.render.ContainerCacheProp = ContainerCacheProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var ContainerBoundsProp = (function(pSuper) {
    var Rect = benri.geometry.Rect;
    var ABS_BOUNDS_MASK = theatre.Stage.INVALIDATION_TYPE_DIRECT | 
                          theatre.Stage.INVALIDATION_TYPE_BUBBLE | 
                          theatre.Stage.INVALIDATION_TYPE_CHILD;
    var DISABLE_STAGE_DATA_CACHE_MASK = theatre.Stage.STATE_PREPARING |
                                        theatre.Stage.STATE_SCRIPTING;
    /**
     * @constructor
     */
    function ContainerBoundsProp() {
      pSuper.call(this);

      this.type = 'bounds';
    }
  
    var tProto = ContainerBoundsProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = ContainerBoundsProp;

    tProto.getBounds = function getBounds() {
      var tBounds = this.getAbsoluteBounds();

      if (tBounds === null) {
        return null;
      }

      var tMatrix = this.actor.getAbsolutePosition().invert();

      tBounds = tBounds.clone();
      tBounds.transform(tMatrix);
      tMatrix.recycle();
      return tBounds;
    };

    tProto.getLocalBounds = function getLocalBounds() {
      var tBounds = this.getAbsoluteBounds();

      if (tBounds === null) {
        return null;
      }

      var tMatrix = this.actor.parent.getAbsolutePosition().invert();

      tBounds = tBounds.clone();
      tBounds.transform(tMatrix);
      tMatrix.recycle();
      return tBounds;
    };

    tProto.getAbsoluteBounds = function getAbsoluteBounds() {
      var tActor = this.actor;
      var tStage = tActor.stage;

      if (tStage === null) {
        return null;
      }

      var tRect = tStage.getActorStageData(tActor, ABS_BOUNDS_MASK, 'containerbounds');

      if (tRect !== void 0) {
        if (tRect === null) {
          return null;
        }
        
        return tRect;
      }

      var tNode = tActor.node;
      var tBoundingRect;
      var tWidth, tHeight;
      var tNextChildNode;
      var tRect2 = null;
      var tProp = void 0;
      var tHasBounds = false;

      var tMinX, tMinY, tMaxX, tMaxY;
      var tVerticies;

      if (tNode.hasChild === false) {
        tRect = null;
      } else {
        tNextChildNode = tNode.next;

        while (tNextChildNode !== null) {
          tProp = tNextChildNode.actor.props.bounds;

          if (tProp !== void 0) {
            tRect2 = tProp.getAbsoluteBounds();

            if (tRect2 === null) {
              tNextChildNode = tNextChildNode.nextSibling;

              continue;
            }

            if (tHasBounds === false) {
              tHasBounds = true;
              tVerticies = tRect2.verticies;

              tMinX = tVerticies[0];
              tMinY = tVerticies[1];
              tMaxX = tVerticies[4];
              tMaxY = tVerticies[5];
            } else {
              tVerticies = tRect2.verticies;

              if (tVerticies[0] < tMinX) {
                tMinX = tVerticies[0];
              }

              if (tVerticies[4] > tMaxX) {
                tMaxX = tVerticies[4];
              }

              if (tVerticies[1] < tMinY) {
                tMinY = tVerticies[1];
              }

              if (tVerticies[5] > tMaxY) {
                tMaxY = tVerticies[5];
              }
            }
          }          

          tNextChildNode = tNextChildNode.nextSibling;
        }

        if (tHasBounds === false && (tStage.state & DISABLE_STAGE_DATA_CACHE_MASK) === 0) {
          tStage.setActorStageData(tActor, ABS_BOUNDS_MASK, 'containerbounds', null);

          return null;
        }

        tRect = new Rect();
        tRect.init(tMinX, tMinY, tMaxX - tMinX, tMaxY - tMinY);
      }

      if ((tStage.state & DISABLE_STAGE_DATA_CACHE_MASK) === 0) {
        tStage.setActorStageData(tActor, ABS_BOUNDS_MASK, 'containerbounds', tRect);
      }

      return tRect;
    };
  
    return ContainerBoundsProp;
  })(theatre.Prop);

  theatre.crews.bounds.ContainerBoundsProp = ContainerBoundsProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var BoundsProp = (function(pSuper) {
    var Rect = benri.geometry.Rect;
    var ABS_BOUNDS_MASK = theatre.Stage.INVALIDATION_TYPE_DIRECT | 
                          theatre.Stage.INVALIDATION_TYPE_BUBBLE | 
                          theatre.Stage.INVALIDATION_TYPE_CHILD;
    var DISABLE_STAGE_DATA_CACHE_MASK = theatre.Stage.STATE_PREPARING |
                                        theatre.Stage.STATE_SCRIPTING;
    /**
     * @constructor
     * @param {number} pWidth
     * @param {number} pHeight
     */
    function BoundsProp(pOriginX, pOriginY, pWidth, pHeight) {
      pSuper.call(this);
      
      this.type = 'bounds';

      this.width = pWidth;
      this.height = pHeight;

      this.originX = pOriginX;
      this.originY = pOriginY;
    }
  
    var tProto = BoundsProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = BoundsProp;
 
    tProto.getBounds = function getBounds() {
      return Rect.obtain(this.originX, this.originY, this.width, this.height);
    };

    tProto.getLocalBounds = function getLocalBounds() {
      return this.getBounds().transform(this.actor.position);
    };

    tProto.getAbsoluteBounds = function getAbsoluteBounds() {
      var tActor = this.actor;
      var tStage = tActor.stage;

      if (tStage === null) {
        return null;
      }

      var tRect = tStage.getActorStageData(tActor, ABS_BOUNDS_MASK, 'bounds');

      if (tRect !== void 0) {
        if (tRect === null) {
          return null;
        }
        
        return tRect;
      }

      tRect = new Rect();
      tRect.init(this.originX, this.originY, this.width, this.height);
      var tMatrix = tActor.getAbsolutePosition();
      tRect.transform(tMatrix);
      tMatrix.recycle();

      if ((tStage.state & DISABLE_STAGE_DATA_CACHE_MASK) === 0) {
        tStage.setActorStageData(tActor, ABS_BOUNDS_MASK, 'bounds', tRect);
      }

      return tRect;
    };

    return BoundsProp;
  })(theatre.Prop);

  theatre.crews.bounds.BoundsProp = BoundsProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Matrix2D = benri.geometry.Matrix2D;
  var TraversalNode = theatre.TraversalNode;
  var EventEmitter = benri.event.EventEmitter;
  var IndexMap = benri.util.IndexMap;
  var ABS_POS_MASK = theatre.Stage.INVALIDATION_TYPE_DIRECT | theatre.Stage.INVALIDATION_TYPE_CHILD;
  var DISABLE_STAGE_DATA_CACHE_MASK = theatre.Stage.STATE_PREPARING |
                                      theatre.Stage.STATE_SCRIPTING;

  theatre.Actor = Actor;

  function onActorEnter(pCurrentNode, pData) {
    var tActor = pCurrentNode.actor;

    if (tActor.parent === null) {
      return;
    }

    var tStage = tActor.stage = tActor.parent.stage;

    tStage.registerActor(tActor);

    if (tActor.isActing) {
      tActor.emit('prepare');
    }
    
    tActor.emit('enter');
  }

  function onActorLeave(pCurrentNode, pData) {
    var tActor = pCurrentNode.actor;
    var tStage = tActor.stage;

    if (tStage === null) {
      return;
    }

    tActor.emit('leave');

    tStage.unregisterActor(tActor);

    tActor.stage = null;
  };

  function onPrepare(pData, pTarget) {
    if (pTarget.isActing === false) {
      return;
    }

    pTarget._prepare();
  }

  function onEnter(pData, pTarget) {
    var tStage = pTarget.stage;

    var tInvalidationInfo = pTarget.invalidationInfo;

    tInvalidationInfo.numOfEnters++;
    tInvalidationInfo.enterStep = pTarget.parent.getCurrentStep();

    pTarget.start();
    pTarget.invalidate();
  }

  function InvalidationInfo() {
    /**
     * True if invalidate has been called on this Actor.
     * @type {boolean}
     * @default false
     */
    this.isDirectlyInvalidated = false;

    /**
     * True if invalidate has been called on this Actor
     * or on any child actors.
     * @type {boolean}
     * @default false
     */
    this.isInvalidated = false;

    this.isPreparing = false;

    this.isFromTimeline = false;

    this.numOfEnters = 0;

    this.enterStep = -1;

    this.sceneInfo = null;

    this.sceneActorId = -1;

    this.isPrepareLocked = false;
  }

  function Props(pActor) {
    this._actor = pActor;
    this._map = new IndexMap(1);

    this.add = _addProp;
    this.get = _getProps;
    this.remove = _removeProp;
  }

  function _addProp(pProp) {
    pProp.id = this._map.add(pProp);

    this[pProp.type] = pProp;

    pProp.onAdd(this._actor);
  }

  function _getProps(pType) {
    var tResult = [];
    var tMap = this._map;

    for (var i = 0, il = tMap.size; i < il; i++) {
      if (tMap[i] && tMap[i].type === pType) {
        tResult.push(tMap[i]);
      }
    }

    return tResult;
  }

  function _removeProp(pProp) {
    this._map.remove(pProp.id);
    pProp.onRemove();
    pProp.id = -1;

    if (this[pProp.type] === pProp) {
      this[pProp.type] = void 0;
    }
  }


  var mGlobalIds = 0;

  /**
   * The base object for working with something on a stage.
   * @constructor
   * @name theatre.Actor
   */
  function Actor() {
    this.id = ++mGlobalIds;

    this.position = Matrix2D.obtain();

    new EventEmitter(this);

    /**
     * The Stage this Actor is part of.
     * @type {theatre.Stage}
     */
    this.stage = null;

    this.stageId = -1;

    /**
     * The layer this Actor is on.
     * @type {number}
     */
    this.layer = -1;

    /**
     * Reference to the TraversalNode this Actor belongs to.
     * @type {TraversalNode}
     */
    this.node = new TraversalNode(this);

    /**
     * True if this Actor is currently active.
     * @type {boolean}
     * @default false
     */
    this.isActing = false;
    
    this.invalidationInfo = new InvalidationInfo();

    /**
     * The parent of this Actor
     * @type {theatre.Actor}
     */
    this.parent = null;

    /**
     * The name of this Actor
     * @private
     * @type {string}
     */
    this.name = null;

    this._scene = null;

    this._sceneInstance = null;

    /**
     * @private
     * @type {number}
     */
    this._layerCounter = 0;

    /**
     * A free property to store arbitrary data.
     * @type {object}
     */
    this.data = {};

    this.props = new Props(this);

    this.on('enter', onEnter);
  }



  var tProto = Actor.prototype;

  tProto.constructor = Actor;

  tProto.get = function(pQuery) {
    if (typeof pQuery !== 'string') {
      return null;
    }

    var tQueryLength = pQuery.length;

    if (tQueryLength === 0) {
      return this;
    }

    var tActor = this;
    var tParts = pQuery.split(/\//);
    var tPartsLength = tParts.length;
    var tPart;
    var tLayer;

    for (var i = 0; i < tPartsLength; i++) {
      tPart = tParts[i];

      if (tPart === '..') {
        tActor = tActor.parent;
      } else if (tPart.length === 0) {
        if (i !== 0) {
          continue;
        }

        if (tActor.stage !== null) {
          tActor = tActor.stage.stageManager;
        } else {
          return null;
        }
      } else if (tPart.charAt(0) === '@') {
        // Layer lookup
        tLayer = parseInt(tPart.substring(1), 10);

        if (tLayer === tLayer) { // NaN check
          tActor = tActor.getActorAtLayer(tLayer);
        } else {
          return null;
        }
      } else {
        tActor = tActor.getActorByName(tPart);
      }

      if (tActor === null) {
        return null;
      }
    }

    return tActor;
  };

  tProto.invalidate = function() {
    var tStage = this.stage;
    var tInvalidationInfo = this.invalidationInfo;

    tInvalidationInfo.isDirectlyInvalidated = true;

    if (tStage !== null) {
      tStage.invalidateActor(this);
    }
  };

  tProto._prepare = function() {
    var tScene = this._scene;

    if (!tScene) {
      return;
    }

    var tSceneInstance = this._sceneInstance;
    var tLength = tScene.getLength();
    var tCurrentStep;
    var tLooped = tSceneInstance.looped;
    var tPreviousStep;
    var tDelta;
    var i, il;

    if (tLooped === true && tLength <= 1) {
      this.stop();

      return;
    }

    tCurrentStep = tSceneInstance.current;
    tPreviousStep = tSceneInstance.previous;

    tDelta = tCurrentStep - tPreviousStep;

    if (tDelta < 0 || tLooped) {
      tPreviousStep = -1;

      var tChildren = this.getActors();
      var tChild;
      var tInvalidationInfo;

      for (i = 0, il = tChildren.length; i < il; i++) {
        tChild = tChildren[i];
        tInvalidationInfo = tChild.invalidationInfo;

        if (tInvalidationInfo.isFromTimeline && tInvalidationInfo.sceneInfo.enter > tCurrentStep) {
          tSceneInstance.actors[tInvalidationInfo.sceneActorId] = void 0;
          tChild.leave();
        }
      }
    }

    tSceneInstance.target = tCurrentStep;

    for (i = tPreviousStep + 1, il = tCurrentStep; i <= il; i++) {
      tSceneInstance.current = i;

      if (i === tCurrentStep) {
        // At the current frame, so to ensure
        // correct execution order of scripts
        // add our own scripts here
        if (this.stage !== null) {
          this.stage.scheduleScripts(tScene, i, this);
        }
      }

      tScene.doPreparedScripts(i, this);
    }
  };

  tProto.scheduleScripts = function(pStep, pActor) {
    if (this.stage === null || this._scene === null) {
      return;
    }

    if (pStep === void 0) {
      pStep = this._sceneInstance.current;
    }

    if (this.hasScripts(pStep) === false) {
      return;
    }

    if (!pActor) {
      pActor = this;
    }

    this.stage.scheduleScripts(this._scene, pStep, pActor);
  };

  tProto.hasScripts = function(pStep) {
    var tScene = this._scene;

    if (tScene === null) {
      return false;
    }

    if (pStep === void 0) {
      pStep = this._sceneInstance.current;
    }

    if (tScene.getNumOfScripts(pStep) === 0) {
      return false;
    }

    return true;
  };

  tProto.start = function() {
    if (this.isActing === false) {
      this.on('prepare', onPrepare);
      this.isActing = true;
      this.emit('prepare');
    }
  };

  tProto.startNextStep = function() {
    if (this.isActing === false) {
      this.on('prepare', onPrepare);
      this.isActing = true;
    }
  };

  tProto.stop = function() {
    if (this.isActing === true) {
      this.ignore('prepare', onPrepare);
      this.isActing = false;
    }
  };

  tProto.goto = function(pStep) {
    var tScene = this._scene;
    var tCurrentStep;

    if (tScene === null || pStep < 0 || pStep >= tScene.getLength()) {
      return false;
    }

    tCurrentStep = this._sceneInstance.current;

    if (pStep === tCurrentStep) {
      return true;
    }

    this._step(pStep - tCurrentStep);
    this._prepare();

    return true;
  };

  tProto.gotoLabel = function(pName) {
    var tScene = this._scene;
    var tCurrentStep;

    if (tScene === null) {
      return false;
    }

    var tStep = tScene.getLabel(pName);

    if (tStep < 0 || tStep >= tScene.getLength()) {
      return false;
    }

    tCurrentStep = this._sceneInstance.current;

    if (tStep === tCurrentStep) {
      return true;
    }

    this._step(tStep - tCurrentStep);
    this._prepare();

    return true;
  };

  tProto.setStep = function(pStep) {
    var tSceneInstance = this._sceneInstance;

    if (tSceneInstance === null) {
      return false;
    }

    return tSceneInstance.setStep(pStep);
  };

  tProto.setScene = function(pScene) {
    if (this._scene === pScene) {
      return;
    }

    var tChildren = this.getActors();

    for (var i = 0, il = tChildren.length; i < il; i++) {
      tChildren[i].leave();
    }

    if (this._sceneInstance !== null) {
      this._sceneInstance.reset();
    }

    this._scene = pScene;
    this._sceneInstance = pScene.createInstance();
  };

  tProto.getScene = function() {
    return this._scene;
  };

  tProto.getSceneInstance = function() {
    return this._sceneInstance;
  }

  /**
   * Steps through scene by the delta provided.
   * @private
   * @param {number} pDelta
   */
  tProto._step = function(pDelta) {
    var tSceneInstance = this._sceneInstance;

    if (tSceneInstance === null) {
      return;
    }

    tSceneInstance.step(pDelta);
  };

  tProto.addActor = function(pActor) {
    this.addActorAtLayer(pActor, this._layerCounter++);
  };

  tProto.addActorAtLayer = function(pActor, pLayer) {
    var tStage = this.stage;
    var tNode = pActor.node;

    if (pActor.stage !== null || pActor.parent !== null) {
      return null;
    }

    pActor.layer = pLayer;

    if (!this.node.appendChild(tNode)) {
      return null;
    }

    if (pLayer > this._layerCounter) {
      this._layerCounter = pLayer + 1;
      // TODO: Decrease this number on leave()
    }

    pActor.stage = tStage;
    pActor.parent = this;

    if (tStage !== null) {
      tNode.processTopDownFirstToLast(onActorEnter, null);
    }

    /*if (pActor.name) {
      if (!this.data.actors) {
        this.data.actors = {};
      }
      this.data.actors[pActor.name] = pActor;
    }*/

    return pActor;
  };

  tProto.getActors = function() {
    var tNode = this.node;

    if (!tNode.hasChild) {
      return [];
    }

    var tChildActors = [];
    var tNextChildNode = tNode.next;

    while (tNextChildNode) {
      tChildActors.push(tNextChildNode.actor);
      tNextChildNode = tNextChildNode.nextSibling;
    }

    return tChildActors;
  };

  tProto.getActorAtLayer = function(pLayer) {
    var tNode = this.node;

    if (!tNode.hasChild) {
      return null;
    }

    var tNextChildNode = tNode.next;

    while (tNextChildNode) {
      if (tNextChildNode.actor.layer === pLayer) {
        return tNextChildNode.actor;
      }

      tNextChildNode = tNextChildNode.nextSibling;
    }

    return null;
  };

  tProto.getActorByName = function(pName) {
    var tNode = this.node;

    if (!tNode.hasChild) {
      return null;
    }

    var tNextChildNode = tNode.next;

    while (tNextChildNode) {
      if (tNextChildNode.actor.name === pName) {
        return tNextChildNode.actor;
      }

      tNextChildNode = tNextChildNode.nextSibling;
    }

    return null;
  };

  tProto.leave = function() {
    var tNode = this.node;
    var tParent = this.parent;

    if (tParent !== null) {
      this.invalidate();

      tNode.processBottomUpLastToFirst(onActorLeave, null);
      tNode.leave();

      this.parent = null;
    }

    this.stop();
  };

  tProto.getCurrentStep = function() {
    var tSceneInstance = this._sceneInstance;

    if (tSceneInstance === null) {
      return -1;
    }

    return tSceneInstance.current;
  };

  tProto.getAbsolutePosition = function() {
    var tStage = this.stage;

    if (tStage === null) {
      return this.position.clone();
    }

    var tPosition = tStage.getActorStageData(this, ABS_POS_MASK, 'position');

    if (tPosition !== void 0) {
      return tPosition.clone();
    }

    var tParent = this.parent;

    if (tParent !== null) {
      tPosition = tParent.getAbsolutePosition().multiply(this.position);
    } else {
      tPosition = this.position.clone();
    }

    if ((tStage.state & DISABLE_STAGE_DATA_CACHE_MASK) === 0) {
      tStage.setActorStageData(this, ABS_POS_MASK, 'position', tPosition.clone());
    }

    return tPosition;
  };
  
}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * The overall manager of all Actors on a Stage.
   * @class
   * @extends {theatre.Actor}
   */
  var StageManager = (function(pSuper) {
    function StageManager() {
      pSuper.call(this);
    }

    StageManager.prototype = Object.create(pSuper.prototype);
    StageManager.prototype.constructor = StageManager;

    return StageManager;
  })(theatre.Actor);

  theatre.StageManager = StageManager;

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  benri.mem.Keeper = Keeper;

  var EventEmitter = benri.event.EventEmitter;
  var LinkedNode = benri.util.LinkedNode;

  function KeepKey() {
  }

  function KeeperInstance() {
    this.keys = null;
    this.shouldDestroy = false;
    this.isDestroyed = false;
  }

  /**
   * Extends a given object to add reference counter functionality.
   * This function can be either used as a constructor (w/ pInstance) or a filter function (w/o pInstance.)
   * @param  {object} pInstance The object to extend.
   */
  function Keeper(pInstance) {
    pInstance = pInstance || this;

    pInstance._keeper = new KeeperInstance();

    if (EventEmitter.isEmitter(pInstance) === false) {
      EventEmitter(pInstance);
    }

    pInstance.keep = keep;
    pInstance.release = release;
    pInstance.destroy = destroy;
  };

  Keeper.isKeeper = function(pObject) {
    return (
      pObject !== null &&
      pObject !== void 0 &&
      '_keeper' in pObject
    );
  };

  /**
   * Increase the reference counter.
   * @return {KeepKey} A key that will be required on release()
   */
  function keep() {
    var tKeepKey = new KeepKey();
    var tKeeper = this._keeper;

    if (tKeeper.keys === null) {
      tKeeper.keys = new LinkedNode(tKeepKey, null);
    } else {
      tKeeper.keys.add(tKeepKey)
    }

    return tKeepKey;
  }

  /**
   * Decrease the reference counter.
   * @param  {KeepKey} pKeepKey A key returned by the corresponding keep()
   */
  function release(pKeepKey) {
    var tKeeper = this._keeper;
    var tNode = tKeeper.keys;
    var tRoot = tNode;
    var tNext;

    if (tNode === null) {
      return;
    }

    do {
      tNext = tNode.next;

      if (tNode.data === pKeepKey) {  
        tNode.remove();

        if (tNode === tRoot) {
          tKeeper.keys = tNext;

          if (tNext === null) {
            if (tKeeper.shouldDestroy === true && tKeeper.isDestroyed === false) {
              tKeeper.isDestroyed = true;
              this.emit('destroy');
            }

            return;
          }
        }
      }
    } while ((tNode = tNext) !== null);
  }

  /**
   * Forcibly destroys this object.
   * Destroyed objects cannot be used in the future.
   */
  function destroy() {
    var tKeeper = this._keeper;

    if (tKeeper.shouldDestroy === true) {
      return;
    }

    tKeeper.shouldDestroy = true;

    if (tKeeper.keys === null) {
      tKeeper.isDestroyed = true;
      this.emit('destroy');
    }
  }

}());

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var EventEmitter = benri.event.EventEmitter;

  global.benri.media.MediaRenderer = MediaRenderer;

  /**
   * A class that consumes media data.
   * @constructor
   * @param {benri.media.MediaData} Media data to render.
   */
  function MediaRenderer() {
    this.playbackState = MediaRenderer.PLAYBACK_STATE_READY;
    EventEmitter(this);
  }

  MediaRenderer.PLAYBACK_STATE_NOT_READY         = 0;
  MediaRenderer.PLAYBACK_STATE_READY             = 1;
  MediaRenderer.PLAYBACK_STATE_PLAYING           = 2;
  MediaRenderer.PLAYBACK_STATE_PAUSED            = 3;

  /**
   * Starts the playback.
   * @param {object} An object holding key-value pairs of playback options.
   *    Following options are supproted:
   *    {
   *      startTime: {Number} Playback offset in milliseconds.
   *      loop: {Boolean} Whether to loop.
   *    }
   */
  MediaRenderer.prototype.play = function(pOptions) {
  };

  /**
   * Stops the playback.
   */
  MediaRenderer.prototype.stop = function() {
  };

  /**
   * Pauses the playback.
   */
  MediaRenderer.prototype.pause = function() {
  };

  /**
   * Resumes the playback.
   */
  MediaRenderer.prototype.resume = function() {
  };

  /**
   * Moves the playback position.
   * @param {Number} pTime A specific point in the playback time in milliseconds.
   */
  MediaRenderer.prototype.seekTo = function(pTime) {
  };

  /**
   * Returns the current playback time.
   * @return {Number} Current playback point in milliseconds.
   */
  MediaRenderer.prototype.getPlaybackTime = function() {
  };

  /**
   * Gets current volume.
   * @return {Number} Volume from 0.0 to 1.0.
   */
  MediaRenderer.prototype.getVolume = function() {
  };

  /**
   * Sets the volume.
   * @param {Number} Volume from 0.0 to 1.0.
   */
  MediaRenderer.prototype.setVolume = function(pVolume) {
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var mImplClass;

  /**
   * @class
   * @extends {benri.media.MediaRenderer}
   */
  var AudioRenderer = (function(pSuper) {
    function AudioRenderer(pAudioData) {
      pSuper.call(this);
      this.audio = pAudioData;
    }

    AudioRenderer.prototype = Object.create(pSuper.prototype);
    AudioRenderer.prototype.constructor = AudioRenderer;

    return AudioRenderer;
  })(benri.media.MediaRenderer);

  benri.media.audio.AudioRenderer = AudioRenderer;

  /**
   * A class method to return an impl object.
   */
  AudioRenderer.create = function(pAudioData) {
    if (mImplClass === void 0) {
      mImplClass = benri.impl.get('media.audio.AudioRenderer').best;
    }
    return new mImplClass(pAudioData);
  };


  // Append something specific to audio.

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var theatre = global.theatre;
  var benri = global.benri;
  var MediaRenderer = benri.media.MediaRenderer;
  var AudioRenderer = benri.media.audio.AudioRenderer;
  var mActions = theatre.crews.swf.actions;


  theatre.crews.swf.actionsMap.startSound = mActions.PREPARE_STARTSOUND = 0x105;
  theatre.crews.swf.actionsMap.soundStreamBlock = mActions.PREPARE_SOUNDSTREAMBLOCK = 0x106;

  /**
   * Sets up playing back event sounds.
   * @param {theatre.Actor} pSpriteActor The Sprite Actor the sound belongs to.
   * @param {Object} pData The data to use to know haw to play back the sound.
   */
  theatre.Scene.registerPreparedCallback(
    mActions.PREPARE_STARTSOUND,
    function startSound(pSpriteActor, pData) {
      var tId = pData.soundId,
          tInfo = pData.soundInfo,
          tSound = pSpriteActor.player.media.get(tId + ''),
          tAudioContext = pSpriteActor.stage.props.audio.context,
          tRenderer = tAudioContext.get(tId);

      //console.log('StartSound: id=' + tId);
      //console.log(tSound);
      //console.log(tInfo);

      if (tInfo.syncStop) {
          // Stop sound
          if (tRenderer) {
            tRenderer.stop();
          }
      } else {
          // Create AudioProp
          if (!tRenderer) {
            tRenderer = AudioRenderer.create(tSound);
            tAudioContext.add(tId, tRenderer);
          }
          if (tRenderer.playbackState !== MediaRenderer.PLAYBACK_STATE_PLAYING) {
            // Start sound
            tRenderer.play();
          }
      }
    }
  );

  /**
   * Sets up playing back audio streams.
   * @param {theatre.Actor} pSpriteActor The Sprite Actor the sound belongs to.
   * @param {Object} pParams An object containing a dictionary-actor map object.
   * @param {Object} pData The audio data.
   */
  theatre.Scene.registerPreparedCallback(
    mActions.PREPARE_SOUNDSTREAMBLOCK,
    function soundStreamBlock(pSpriteActor, pData) {
      var tMetadata = pSpriteActor.player.soundStreamHead,
          tSound = pData.soundData;

      //console.log('SoundStreamBlock:');
      //console.log(tMetadata);
      //console.log(tSound);

      // Feed stream data
    }
  );
}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var impl = benri.impl = {};

  benri.event.EventEmitter(impl);

  /**
   * Add a new implementation
   * @param {string} pId       A unique ID
   * @param {function} pCallback A callback function
   */
  impl.add = function(pId, pCallback) {
    impl.on('getimpl.' + pId, pCallback);
  };

  /**
   * Get an implementation of the given ID.
   * @param  {string} pId    A unique ID
   * @param  {object} pHints Hints
   */
  impl.get = function(pId, pHints) {
    var tImpls = [];

    /**
     * Add an implementation for this get request.
     * Set a score to automatically choose the best
     * choice for the implementation.
     * @param {function} pClass The class for the implmentation
     * @param {number} pScore A score for how important this implementation is
     */
    function add(pClass, pScore) {
      tImpls.push({
        clazz: pClass,
        score: pScore
      });
    }

    impl.emit('getimpl.' + pId, {
      id: pId,
      add: add,
      hints: pHints
    });

    if (tImpls.length === 0) {
      return null;
    }

    var tBestImpl = tImpls[0].clazz;
    var tBestScore = tImpls[0].score;

    for (var i = 1, il = tImpls.length; i < il; i++) {
      if (tImpls[i].score >= tBestScore) {
        tBestScore = tImpls[i].score;
        tBestImpl = tImpls[i].clazz;
      }
    }

    return {
      best: tBestImpl,
      bestScore: tBestScore,
      list: tImpls
    };
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var impl = benri.impl;

  benri.text.Encoder = Encoder;

  function Encoder(pType) {
    this.type = pType;

    var tImpl = impl.get('text.encoder.' + pType);

    if (tImpl === null) {
      throw new Error('No encoder for type.');
    }

    this._impl = new tImpl.best();
  }

  Encoder.prototype.encode = function(pString) {
    return this._impl.encode(pString);
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var impl = benri.impl;

  benri.text.Decoder = Decoder;

  function Decoder(pType) {
    this.type = pType;

    var tImpl = impl.get('text.decoder.' + pType);

    if (tImpl === null) {
      throw new Error('No decoder for type.');
    }

    this._impl = new tImpl.best();
  }

  Decoder.prototype.decode = function(pBuffer, pOffset, pEndIndex) {
    pOffset = pOffset || 0;
    return this._impl.decode(pBuffer, pOffset, pEndIndex || (pBuffer.size - pOffset));
  };

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var impl = benri.impl;

  benri.mem.MemoryMetrics = MemoryMetrics;

  /**
   * @constructor
   * A class for getting metrics from various
   * types of memory. Defaults to 'sys'.
   * @param {Array.<string>=['sys']} pTypeHints
   */
  function MemoryMetrics(pTypeHints) {
    this._impl = new (impl.get('mem.metrics', pTypeHints ? pTypeHints : {type: 'sys'}).best)(pTypeHints);
  }

  /**
   * Returns all statistics available from the 
   * current implementation as an object.
   * @return {Object}
   */
  MemoryMetrics.prototype.getAll = function() {
    return this._impl.getAll();
  };
 
  /**
   * Returns the total amount of memory from the 
   * current implementation as an object.
   * @return {number}
   */
  MemoryMetrics.prototype.getTotal = function() {
    return this._impl.getTotal();
  };

  /**
   * Returns the amount of memory available from the 
   * current implementation as an object.
   * @return {number}
   */
  MemoryMetrics.prototype.getFree = function() {
    return this._impl.getTotal();
  };

  /**
   * Returns the amount of memory currently used from the 
   * current implementation as an object.
   * @return {number}
   */
  MemoryMetrics.prototype.getUsed = function() {
    return this._impl.getTotal() - this._impl.getFree();
  };

  /**
   * Checks if there is enought free memory.
   * @return {boolean} True if there is NOT enought memory.
   */
  MemoryMetrics.prototype.isTight = function() {
    return this._impl.isTight();
  };

  /**
   * Gives a hint about memory usage.
   * @param {number} The amount of used memory.
   *  Negative number means returning no longer used memory.
   */
  MemoryMetrics.prototype.use = function(pAmount) {
    return this._impl.use(pAmount);
  };

  /**
   * NameSpace to hold system supervisors.
   */
  benri.mem.metrics = {};

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var mem = benri.mem;
  var MemoryMetrics = mem.MemoryMetrics;

  /**
   * Memory supervisor - API usage overview
   *
   * Below is the basic usage of the APIs.
   *
   *  // Define a type.
   *  function Class(x, y) {
   *    this.x = x;
   *    this.y = y;
   *  }
   *  
   *  // Create a pool for the type. (see the definition of InstancePool.)
   *  var mPool = new InstancePool({
   *    refill : function (pPool, pData) {  
   *      var tPool = pPool.list;
   *      if (!tPool) {
   *        tPool = pPool.list = [];
   *      }
   *      for (var i = 0; i < 10; i++) {
   *        tPool[i].push(new Class(256, 256));      
   *      }
   *    },
   *    obtain : function (pPool, pData, pArgs) {  
   *      var tPool = pPool.list;
   *      var tInstance = tPool.pop();
   *      if (!tInstance) {
   *        return null;
   *      }
   *      tInstance.x = pArgs[0];
   *      tInstance.y = pArgs[1];
   *      return tInstance;
   *    },
   *    recycle : function (pPool, pData, pInstance) {  
   *      var tPool = pPool.list;
   *      tPool.push(pInstance);
   *    }
   *  });
   *  
   *  // Wrap the pool's methods around your type.
   *  Class.obtain = function (x, y) {
   *    var tInstance = mPool.obtain([x, y]);
   *    tInstance.recycle = function () {
   *      delete this.recycle;
   *      mPool.recycle(this);
   *    };
   *    return tInstance;
   *  };
   *
   *  // Obtain an instance from the pool.
   *  var tInstance = Class.obtain(128, 128);
   *
   *  // Return the instance back to the pool.
   *  tInstance.recycle();
   *
   *  // You can bind your pool to memory supervisor.
   *  // 'benri.mem.getDefaultSupervisor' returns the system-wide, pre-defined supervisor.
   *  mPool.setOptions({supervisor : benri.mem.getDefaultSupervisor()});
   *
   *  // Now, obtain() can return null.
   *  var tInstance = Class.obtain(256, 256);
   *  if (!tInstance) {
   *    console.error('Out of memory.');
   *  }
   *
   *  // You can create your own supervisor and set it to the pool.
   *  // Each supervisor is in charge of scheduling memory cleanup and statistics data collection.
   *  var mPool = new InstancePool({
   *    supervisor : new MemorySupervisor(), // supervisor
   *    refill : function (pPool) {  
   *      ...;
   *    },
   *  });
   *  
   */

  mem.MemorySupervisor = MemorySupervisor;

  /**
   * Class that keeps watch on the state of system memory.
   *
   * @constructor
   * @param  {object} pOptions An object that contains key-value pairs of parameters.
   *
   *    Valid options are:
   *
   *      metricsTypeHints {string} Type of memory metrics (default='sys'.)
   *
   *      cleanUpInterval {number} If specified, memory clean-up will occur in the inteval specified here in milliseconds.
   *                               If not specified, no clean-up will occur.
   *
   *      statisticsInterval {number} If specified, field statistics data will be collected in the inteval specified here in minutes.
   *                                  If not specified, no statistics data will be collected.
   *
   *      broadcastLowMemory {bool} Whether to send 'lowMem' event. (default='false'.)
   *
   */
  function MemorySupervisor(pOptions) {

    pOptions = pOptions || {};

    /**
     * Provides information about system memory state.
     * @type {MemoryMetrics}
     */
    this._metricsType = pOptions.metricsTypeHints;
    this._metrics = null; // Deferred creation.

    /**
     * Memory clean-up occurs in the inteval specified here in milli-second.
     * Zero or negative value means no clean-up should occur.
     * @type {number}
     */
    this._cleanUpInterval = pOptions.cleanUpInterval || 0;

    /**
     * Id of the timer that cleans up memory.
     * @type {number}
     */
    this._cleanUpTimer;

    /**
     * Field statistics data is collected in the inteval specified here in minutes.
     * Zero or negative value means no statistics data should be collected.
     * @type {number}
     */
    this._statisticsInterval = pOptions.statisticsInterval || 0;

    /**
     * Id of the timer that collects statistics data.
     * @type {number}
     */
    this._statisticsTimer;

    /**
     * Whether to send 'lowMem' event.
     * @type {bool}
     */
    this._broadcastLowMemory = pOptions.broadcastLowMemory || false;

    benri.event.EventEmitter(this);

    // Starts timer when the first time a client registers an event listener.
    var tSelf = this;
    var tOn = this.on;
    this.on = function (pName, pListener, pCount) {
      if (pName === 'cleanup' || pName === 'statistics') {
        tSelf._startTimerIfStopped(pName);
      }
      tOn.call(tSelf, pName, pListener, pCount);
    };
  }

  MemorySupervisor.prototype._startTimerIfStopped  = function (pType) {
    var tSelf = this;

    if (pType === void 0 || pType === 'cleanup') {
      if (!this ._cleanUpTimer && this._cleanUpInterval > 0) {
        // Starts cleanup timer.
        this._cleanUpTimer = global.setInterval(function () {
          tSelf.emit('cleanup');
        }, tSelf._cleanUpInterval);
      }
    }

    if (pType === void 0 || pType === 'statistics') {
      if (!this ._statisticsTimer && this._statisticsInterval > 0) {
        // Starts statistics timer.
        this._statisticsTimer = global.setInterval(function () {
          tSelf.emit('statistics');
        }, this._statisticsInterval * 60 * 1000);
      }
    }
  };

  function _createMetrics() {
    var tMetrics, tType = this._metricsType;

    if (mem.metrics['sys'] === void 0) {
      // Create default system supervisor.
      mem.metrics['sys'] = new MemoryMetrics({type: 'sys'});
    }

    tMetrics = mem.metrics[tType || 'sys'];
    return tMetrics || new MemoryMetrics({type: tType});
  }


  /**
   * Wrapper for MemoryMetrics method.
   * @see MemoryMetrics.isTight
   */
  MemorySupervisor.prototype.isTight = function () {
    var tMetrics = this._metrics || _createMetrics();
    return tMetrics.isTight();
  };

  /**
   * Wrapper for MemoryMetrics method.
   * @see MemoryMetrics.use
   */
  MemorySupervisor.prototype.use = function (pSize) {
    var tMetrics = this._metrics || _createMetrics();
    tMetrics.use(pSize);
  };

  /**
   * Issues memory related events.
   * @param {string} pTag The tag attached to the event.
   */
  MemorySupervisor.prototype.requestMemory = function (pTag) {
    if (this._broadcastLowMemory) {
      this.emit('lowMem-' + (pTag ? pTag : 'generic'));
    }
  };


  var mDefaultSupervisor = null;

  var mDefaultNativeSupervisor = null;

  /**
   * Factory method to get the default system supervisor.
   */
  mem.getDefaultSupervisor = function () {

    if (!mDefaultSupervisor) {
      mDefaultSupervisor = new MemorySupervisor({
        metricsTypeHits : 'sys',
        cleanUpInterval : 60000,
        //statisticsInterval : 3
      });
    }
    return mDefaultSupervisor;
  };

  /**
   * Factory method to get the default native supervisor.
   */
  mem.getDefaultNativeSupervisor = function () {

    if (!mDefaultNativeSupervisor) {
      mDefaultNativeSupervisor = new MemorySupervisor({
        metricsTypeHints : 'native',
        cleanUpInterval : 60000,
        broadcastLowMemory: true,
        //statisticsInterval : 3
      });
    }
    return mDefaultNativeSupervisor;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var impl = benri.impl;

  benri.io.compression.Inflator = Inflator;

  function Inflator(pType) {
    this.type = pType;

    var tImpl = impl.get('io.compression.inflator.' + pType);

    if (tImpl === null) {
      throw new Error('No inflator for type.');
    }

    this._impl = new tImpl.best();
  }

  Inflator.prototype.inflate = function(pBuffer, pOptions) {
    return this._impl.inflate(pBuffer, pOptions);
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var impl = benri.impl;

  benri.io.compression.Deflator = Deflator;

  function Deflator(pType) {
    this.type = pType;

    var tImpl = impl.get('io.compression.deflator.' + pType);

    if (tImpl === null) {
      throw new Error('No deflator for type.');
    }

    this._impl = new tImpl.best();
  }

  Deflator.prototype.deflate = function(pBuffer, pOptions) {
    return this._impl.deflate(pBuffer, pOptions);
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var getImpl = benri.impl.get;

  benri.io.Buffer = Buffer;

  function Buffer(pImpl, pData, pSize) {
    this._impl = pImpl;
    this.data = pData;

    this.size = this.length = pSize;

    this.getInt8 = getInt8;
    this.getUint8 = getUint8;
    this.getInt16 = getInt16;
    this.getUint16 = getUint16;
    this.getInt32 = getInt32;
    this.getUint32 = getUint32;
    this.getFloat32 = getFloat32;
    this.getFloat64 = getFloat64;

    this.setInt8 = setInt8;
    this.setUint8 = setUint8;
    this.setInt16 = setInt16;
    this.setUint16 = setUint16;
    this.setInt32 = setInt32;
    this.setUint32 = setUint32;
    this.setFloat32 = setFloat32;
    this.setFloat64 = setFloat64;

    this.copy = copy;
    this.copyTo = copyTo;
    this.copyFrom = copyFrom;
    this.toString = toString;
    this.toArray = toArray;
  }

  var mImpl = null;

  Buffer.create = function(pSize) {
    var tImpl = mImpl === null ? (mImpl = getImpl('io.buffer').best) : mImpl;
    var tData = tImpl.create(pSize);

    return new Buffer(tImpl, tData, tData.length);
  }

  Buffer.fromArray = function(pArray) {
    var tImpl = mImpl === null ? (mImpl = getImpl('io.buffer').best) : mImpl;
    var tData = tImpl.fromArray(pArray);

    return new Buffer(tImpl, tData, tData.length);
  };

  Buffer.fromString = function(pString, pEncoding) {
    return (new benri.text.Encoder(pEncoding || 'ascii')).encode(pString);
  };

  Buffer.fromParts = function(pParts) {
    var tImpl = mImpl === null ? (mImpl = getImpl('io.buffer').best) : mImpl;

    var tPart;
    var i;
    var il = pParts.length;
    var tBuffers = [];
    var tSize = 0;

    for (i = 0; i < il; i++) {
      tPart = pParts[i];

      if (tPart === null || tPart === void 0) {
        continue;
      }

      if (tPart instanceof Buffer) {
        tBuffers.push(tPart);
        tSize += tPart.size;
      } else if (typeof tPart === 'string') {
        tBuffers.push(Buffer.fromString(tPart, 'ascii'));
        tSize += tPart.length;
      } else {
        tBuffers.push(Buffer.fromArray(tPart));
        tSize += tPart.length;
      }
    }

    var tBuffer = new Buffer(tImpl, tImpl.create(tSize), tSize);
    var tOffset = 0;

    for (i = 0, il = tBuffers.length; i < il; i++) {
      tPart = tBuffers[i];

      tBuffer.copyFrom(tPart, tOffset, 0, 0);

      tOffset += tPart.size;
    }

    return tBuffer;
  };

  function copy(pOffset, pSize) {
    return this.copyTo(pOffset, pOffset + pSize);
  }

  function copyTo(pOffset, pEndOffset) {
    var tImpl = this._impl;
    var tData = tImpl.copyTo(this.data, pOffset, pEndOffset);

    return new Buffer(tImpl, tData, tData.length);
  }

  function copyFrom(pSourceBuffer, pDestOffset, pSourceOffset, pSize) {
    var tImpl = this._impl;

    tImpl.copyFrom(this.data, pSourceBuffer.data, pDestOffset || 0, pSourceOffset || 0, pSize || 0);
  }

  function toString(pEncoding) {
    return (new benri.text.Decoder(pEncoding || 'ascii')).decode(this);
  }

  function toArray() {
    var tSize = this.size;
    var tBuffer = this.data;
    var tArray = new Array(tSize);

    for (var i = 0; i < tSize; i++) {
      tArray[i] = tBuffer[i];
    }

    return tArray;
  }

  function getInt8(pOffset) {
    var tByte = this.data[pOffset];

    if (tByte >> 7) {
      return tByte - (1 << 8);
    }

    return tByte;
  };

  function getUint8(pOffset) {
    return this.data[pOffset];
  };

  // Note because I always forget.
  // Little Endian is when the left-most bit is the least significant
  // Regular thinking is Big Endian. *sigh *

  function getInt16(pOffset, pLittleEndian) {
    var tResult = this.getUint16(pOffset, pLittleEndian);

    if (tResult >> 15) {
      return tResult - (1 << 16);
    }

    return tResult;
  };

  function getUint16(pOffset, pLittleEndian) {
    var tSize = 1;
    var tBuffer = this.data;

    if (pLittleEndian) {
      pOffset = pOffset + tSize;
      tSize = -tSize;
    }

    return (tBuffer[pOffset] << 8) | tBuffer[pOffset + tSize];
  };

  function getInt32(pOffset, pLittleEndian) {
    var tResult = this.getUint32(pOffset, pLittleEndian);

    if (tResult >> 31) {
      return tResult - (1 << 16) * (1 << 16);
    }

    return tResult;
  };

  function getUint32(pOffset, pLittleEndian) {
    var tSize = 3;
    var tBuffer = this.data;
    var tMultiplier = 1;

    if (pLittleEndian) {
      pOffset = pOffset + tSize;
      tMultiplier = -1;
    }

    return (
      ((tBuffer[pOffset] << 24) |
      (tBuffer[pOffset + 1 * tMultiplier] << 16) |
      (tBuffer[pOffset + 2 * tMultiplier] << 8) |
      (tBuffer[pOffset + 3 * tMultiplier])) >>> 0);
  };

  function getFloat32(pOffset, pLittleEndian) {
    var tBytes = this.getUint32(pOffset, pLittleEndian);

    var tSign = tBytes >> 31 ? -1 : 1;
    var tExponent = (tBytes >> 23) & 0xFF;
    var tMantissa = tBytes & 0x7FFFFF;

    if (tExponent === 0) {
      if (tMantissa === 0) {
        return 0;
      } else {
        return tSign * Math.pow(2, tExponent - 127) * (tMantissa * Math.pow(2, -22));
      }
    } else if (tExponent === 255) {
      if (tMantissa === 0) {
        return tSign * Infinity;
      } else {
        return tSign * NaN;
      }
    } else {
      return tSign * Math.pow(2, tExponent - 127) * (1 + (tMantissa * Math.pow(2, -23)));
    }
  };

  function getFloat64(pOffset, pLittleEndian) {
    var tBytesFirst, tBytesLast;

    if (pLittleEndian) {
      tBytesFirst = this.getUint32(pOffset, pLittleEndian);
      tBytesLast = this.getUint32(pOffset + 4, pLittleEndian);
    } else {
      tBytesLast = this.getUint32(pOffset, pLittleEndian);
      tBytesFirst = this.getUint32(pOffset + 4, pLittleEndian);
    }

    var tSign = tBytesFirst >> 31 ? -1 : 1;
    var tExponent = (tBytesFirst >> 20) & 0x7FF;
    var tMantissa = (tBytesFirst & 0x3FF) + tBytesLast;

    if (tExponent === 0) {
      if (tMantissa === 0) {
        return 0;
      } else {
        return tSign * Math.pow(2, tExponent - 1023) * (tMantissa * Math.pow(2, -51));
      }
    } else if (tExponent === 2047) {
      if (tMantissa === 0) {
        return tSign * Infinity;
      } else {
        return tSign * NaN;
      }
    } else {
      return tSign * Math.pow(2, tExponent - 1023) * (1 + (tMantissa * Math.pow(2, -52)));
    }
  };

  function setInt8(pOffset, pValue) {
    if (pValue < 0) {
      pValue += 1 << 8;
      this.data[pOffset] = 0x80 | (pValue & 0x7F);
    } else {
      this.data[pOffset] = pValue & 0xFF;
    }
  };

  function setUint8(pOffset, pValue) {
    this.data[pOffset] = pValue & 0xFF;
  };

  function setInt16(pOffset, pValue, pLittleEndian) {
    var tSize = 1;

    if (pLittleEndian) {
      pOffset = pOffset + tSize;
      tSize = -tSize;
    }

    var tBuffer = this.data;

    if (pValue < 0) {
      pValue += 1 << 16;
      pValue |= 0x8000;
    }

    tBuffer[pOffset] = (pValue & 0xFF00) >> 8;
    tBuffer[pOffset + tSize] = pValue & 0xFF;
  };

  function setUint16(pOffset, pValue, pLittleEndian) {
    var tSize = 1;

    if (pLittleEndian) {
      pOffset = pOffset + tSize;
      tSize = -tSize;
    }

    var tBuffer = this.data;

    tBuffer[pOffset] = (pValue & 0xFF00) >> 8;
    tBuffer[pOffset + tSize] = pValue & 0xFF;
  };

  function setInt32(pOffset, pValue, pLittleEndian) {
    var tSize = 3;
    var tMultiplier = 1;
    var tBuffer = this.data;

    if (pLittleEndian) {
      pOffset = pOffset + tSize;
      tMultiplier = -1;
    }

    if (pValue < 0) {
      pValue += (1 << 16) * (1 << 16);
      pValue |= 0x80000000;
    }

    tBuffer[pOffset] = (pValue & 0xFF000000) >> 24;
    tBuffer[pOffset + 1 * tMultiplier] = (pValue & 0xFF0000) >> 16;
    tBuffer[pOffset + 2 * tMultiplier] = (pValue & 0xFF00) >> 8;
    tBuffer[pOffset + 3 * tMultiplier] = pValue & 0xFF;
  };

  function setUint32(pOffset, pValue, pLittleEndian) {
    var tSize = 3;
    var tMultiplier = 1;
    var tBuffer = this.data;

    if (pLittleEndian) {
      pOffset = pOffset + tSize;
      tMultiplier = -1;
    }

    tBuffer[pOffset] = (pValue & 0xFF000000) >> 24;
    tBuffer[pOffset + 1 * tMultiplier] = (pValue & 0xFF0000) >> 16;
    tBuffer[pOffset + 2 * tMultiplier] = (pValue & 0xFF00) >> 8;
    tBuffer[pOffset + 3 * tMultiplier] = pValue & 0xFF;
  };

  function setFloat32(pOffset, pValue, pLittleEndian) {
    var tSize = 3;

    throw new Error('Unimplemented');
  };

  function setFloat64(pOffset, pValue, pLittleEndian) {
    var tSize = 7;

    throw new Error('Unimplemented');
  };

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.net.URLQuery = URLQuery;
  var Decoder = benri.text.Decoder;
  var Buffer = benri.io.Buffer;

  function NameValuePair(pName, pValue) {
    this.name = pName;
    this.value = pValue;
  }

  function URLQuery(pInput) {
    var tValue;
    var i, il, k;

    this._nameValuePairs = [];
    this.decoder = null;
    this.rawInput = pInput;

    this._input(pInput);
  }


  var tProto = URLQuery.prototype;

  tProto._decode = function(pEncodedString) {
    var tDecoder = this.decoder;
    var tDecodedResult;

    if (!tDecoder || tDecoder.type === 'utf-8') {
      try {
        tDecodedResult = decodeURIComponent(pEncodedString);
      } catch (error) {
        // This url is not encoded in UTF-8.
        // Decoding delayed until encoding type specified.
        return pEncodedString;
      }
      return tDecodedResult;
    } else {

      var tEncodedArray;
      var i, il;
      var tSubEncodedArray = [];
      var tSplitedPart;

      tEncodedArray = pEncodedString.split("%");
      tDecodedResult = tEncodedArray.splice(0, 1)[0];

      for (i = 0, il = tEncodedArray.length; i < il; i++) {
        tSplitedPart = tEncodedArray[i];
        tSubEncodedArray.push(('0x' + tSplitedPart.substr(0, 2)) | 0);
        if (tSplitedPart.length > 2) {
          tDecodedResult += tDecoder.decode(Buffer.fromArray(tSubEncodedArray));
          tDecodedResult += tSplitedPart.substr(2);
          tSubEncodedArray = [];
        }
      }
      
      if (tSubEncodedArray.length > 0) {
        tDecodedResult += tDecoder.decode(Buffer.fromArray(tSubEncodedArray));
      }

      return tDecodedResult;
    }
  };


  tProto._input = function(pInput) {
    if (!pInput || pInput.length === 0) {
      return;
    }

    if (typeof pInput !== 'string') {
      var k;
      for (k in pInput) {
        tValue = pInput[k];
        if (tValue instanceof Array) {
          for (i = 0, il = tValue.length; i < il; i++) {
            this.append(k, this._decode(tValue[i]));
          }
        } else {
          this.append(k, this._decode(tValue));
        }
      }
      
      return;
    }

    if (pInput[0] === '?') {
      pInput = pInput.substring(1);
    }

    var tParts = pInput.split('&');
    var tSubpart;
    var tName;
    var tValue;
    var tEqualsIndex;

    for (var i = 0, il = tParts.length; i < il; i++) {
      tSubpart = tParts[i];
      tEqualsIndex = tSubpart.indexOf('=');

      if (tEqualsIndex === -1) {
        this.append(
          decodeURIComponent(tSubpart),
          ''
        );

        continue;
      }

      tName = tSubpart.substring(0, tEqualsIndex);

      if (tName) {
        tValue = tSubpart.substring(tEqualsIndex + 1);

        this.append(
          decodeURIComponent(tName),
          tValue ? this._decode(tValue) : ''
        );
      }
    }
  };

  tProto._find = function(pName) {
    var tPairs = this._nameValuePairs;
    var tPair;

    for (var i = 0, il = tPairs.length; i < il; i++) {
      tPair = tPairs[i];

      if (tPair.name === pName) {
        return tPair;
      }
    }

    return null;
  };

  tProto.get = function(pName) {
    var tPair = this._find(pName);

    return tPair ? tPair.value : null;
  };

  tProto.getAll = function(pName) {
    var tPairs = this._nameValuePairs;

    if (!pName) {
      return tPairs.slice(0);
    }

    var tPair;
    var tResult = [];

    for (var i = 0, il = tPairs.length; i < il; i++) {
      tPair = tPairs[i];

      if (tPair.name === pName) {
        tResult.push(tPair.value);
      }
    }

    return tResult;
  };

  tProto.set = function(pName, pValue) {
    var tPair = this._find(pName);

    if (tPair !== null) {
      tPair.value = pValue;
    } else {
      this._nameValuePairs.push(new NameValuePair(pName, pValue));
    }
  };

  tProto.append = function(pName, pValue) {
    this._nameValuePairs.push(new NameValuePair(pName, pValue));
  };

  tProto.has = function(pName) {
    return this._find(pName) !== null;
  };

  tProto['delete'] = function(pName) {
    var tPairs = this._nameValuePairs;

    for (var i = tPairs.length; i >= 0; i--) {
      if (tPairs[i].name === pName) {
        tPairs.splice(i, 1);
      }
    }
  };

  tProto.getSize = function() {
    return this._nameValuePairs.length;
  };

  tProto.toString = function() {
    var tPairs = this._nameValuePairs;
    var il = tPairs.length;

    if (il === 0) {
      return '';
    }

    var tPair;
    var tParts = [];

    for (var i = 0; i < il; i++) {
      tPair = tPairs[i];

      tParts.push(
        encodeURIComponent(tPair.name) +
        '=' +
        (tPair.value ? encodeURIComponent(tPair.value) : '')
      );
    }

    return '?' + tParts.join('&');
  };

  tProto.toJSON = function() {
    var tPairs = this._nameValuePairs;
    var il = tPairs.length;

    if (il === 0) {
      return {};
    }

    var tPair, tName, tValue;
    var tCurrentValue;
    var tParts = {};

    for (var i = 0; i < il; i++) {

      tPair = tPairs[i];
      tName = tPair.name;
      tValue = tPair.value;
      tCurrentValue = tParts[tName];

      if (tCurrentValue instanceof global.Array) {
        tCurrentValue.unshift(tValue);
      } else if (tCurrentValue !== void 0) {
        tParts[tName] = [tValue, tCurrentValue];
      } else {
        tParts[tName] = tValue;
      }
    }
    return tParts;
  };

  tProto.setEncoding = function(pEncoding) {
    if (this.decoder !== null && pEncoding === this.decoder.type) {
      return;
    }

    if (this.decoder === null && pEncoding === 'utf-8') {
      return;
    }

    this.decoder = new Decoder(pEncoding);

    this._input(this.rawInput);
  };


}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var net = global.benri.net;

  var URLQuery = net.URLQuery;

  net.URL = URL;
/**
 *   foo://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose
 *   \_/   \_______________/ \_________/ \__/\___________________/ \______________________/ \__/
 *    |           |               |       |            |                      |               |
 *    |       userinfo         hostname  port        path                   query         fragment
 *    |    \________________________________/
 *    |                    |
 *    |                    |
 * scheme              authority
 *
 * In reference to RFC 3986.
 */

  /**
   * RegExp you can use to parse an URL.
   * @type {RegExp}
   * @private
   */
  var mAlpha = 'a-zA-Z';
  var mDigit = '0-9';
  var mGenDelims = '\:\/\?#\[\]@';
  var mSubDelims = '\!\$&\'\(\)\*\+\,;\=';
  var mUnreserved = mAlpha + mDigit + '\-\._~';

  var mSchemeReg = '(([' + mAlpha + ']+[' + mAlpha + mDigit + '\+\-\.' + ']*):)';
  var mPathReg = '([' + mSubDelims + mUnreserved + '@%\:\/ ' + ']*)';
  var mQueryReg = '(\\?([' + mSubDelims + mUnreserved + '@%\:\/\? ' + ']*))?';
  var mFragmentReg = '(#([' + mSubDelims + mUnreserved + '@%\:\/\? ' + ']*))?';

  var mStrictURLRegex = new RegExp('^' + mSchemeReg + '(\/\/([^/?#]*))?' + mPathReg + mQueryReg + mFragmentReg + '$');
  var mStrictAuthorityRegex = new RegExp('^((([' + mSubDelims + mUnreserved + '%' + ']+)?(:([' + mSubDelims + mUnreserved + '%\:' + ']*))?)@)?' +
                                   '([' + mSubDelims + mUnreserved + '%' + ']*)?(:([' + mDigit + ']+))?$');
  var mGenericURLRegex = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/;
  var mGenericAuthorityRegex = /^((([^:/?#@]+)?(:([^/?#@]*))?)@)?([^/?#:]*)?(:([0-9]+))?$/;

  function isRelative(pString) {
    return /^(ftp|file|gopher|https?|wss?)(:|$)/.test(pString);
  }

  function URL(pString) {
    this.origin = pString;

    var tIsRelative = isRelative(pString);
    var tURLRegex = tIsRelative ? mStrictURLRegex : mGenericURLRegex;
    var tAuthorityRegex = tIsRelative ? mStrictAuthorityRegex : mGenericAuthorityRegex;

    var tURLMatch = pString.match(tURLRegex);
    if (tURLMatch === null) {
      this.hasParseError = true;
      return;
    }

    this.authority = tURLMatch[4] || '';
    // Further parsing authority into detailed segments
    var tAuthMatch = this.authority.match(tAuthorityRegex);
    if (tAuthMatch === null) {
      this.hasParseError = true;
      return;
    }

    this.scheme = tURLMatch[2] || '';
    this.path = tURLMatch[5] || '';
    this.search = tURLMatch[7] || '';  // query
    this.fragment = tURLMatch[9] || '';
    this.query = new URLQuery(this.search);

    this.username = tAuthMatch[3] || '';
    this.password = tAuthMatch[5] || '';
    this.hostname = tAuthMatch[6] || '';
    this.port = tAuthMatch[8] || '';
    this.host = this.hostname + (this.port ? ':' + this.port : '');

    this.schemeData = pString.slice(this.scheme.length + 1);
    this.hasParseError = false;
  }

  URL.prototype.toString = function(pExcludeFragment) {
    var tString = this.scheme;

    if (isRelative(this.scheme)) {

      if (this.authority) {
        tString += '//' + this.authority;
      }

      tString += (this.path ? this.path : '/');
    } else {
      tString += this.path;
    }
    
    if (this.search) {
      tString += '?' + this.search;      
    }

    if (!pExcludeFragment && this.fragment) {
      tString += '#' + this.fragment;
    }

    return tString;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var io = benri.io;
  var Buffer = io.Buffer;
  var Decoder = benri.text.Decoder;
  io.Reader = Reader;

  function Reader(pSource) {
    this.source = pSource;

    this._index = 0;

    this.encoding = 'ascii';

    this._decoderCache = {};
  }

  var tProto = Reader.prototype;

  tProto.getLength = function() {
    return this.source.size;
  };

  tProto.getCopy = function(pLength) {
    var tIndex = this._index;
    var tBuffer = this.source.copy(tIndex, pLength);

    this._index = tIndex + pLength;

    return tBuffer;
  };

  tProto.getCopyTo = function(pEndIndex) {
    var tBuffer = this.source.copyTo(this._index, pEndIndex);

    this._index = pEndIndex;

    return tBuffer;
  };

  tProto.seek = function(pOffset) {
    var tNewIndex = this._index + pOffset;

    if (tNewIndex > this.source.size) {
      throw new Error('Index out of bounds');
    }

    this._index = tNewIndex;
  };

  tProto.seekTo = function(pIndex) {
    if (pIndex > this.source.size) {
      throw new Error('Index out of bounds');
    }

    this._index = pIndex;
  };

  tProto.tell = function() {
    return this._index;
  };

  tProto.getInt8 = function() {
    return this.source.getInt8(this._index++);
  };

  tProto.getUint8 = function() {
    return this.source.getUint8(this._index++);
  };

  tProto.getInt16 = function(pLittleEndian) {
    var tIndex = this._index;
    this._index = tIndex + 2;

    return this.source.getInt16(tIndex, pLittleEndian);
  };

  tProto.getUint16 = function(pLittleEndian) {
    var tIndex = this._index;
    this._index = tIndex + 2;

    return this.source.getUint16(tIndex, pLittleEndian);
  };

  tProto.getInt32 = function(pLittleEndian) {
    var tIndex = this._index;
    this._index = tIndex + 4;

    return this.source.getInt32(tIndex, pLittleEndian);
  };

  tProto.getUint32 = function(pLittleEndian) {
    var tIndex = this._index;
    this._index = tIndex + 4;

    return this.source.getUint32(tIndex, pLittleEndian);
  };

  tProto.getFloat32 = function(pLittleEndian) {
    var tIndex = this._index;
    this._index = tIndex + 4;

    return this.source.getFloat32(tIndex, pLittleEndian);
  };

  tProto.getFloat64 = function(pLittleEndian) {
    var tIndex = this._index;
    this._index = tIndex + 8;

    return this.source.getFloat64(tIndex, pLittleEndian);
  };

  tProto.getChar = function() {
    return String.fromCharCode(this.source.getUint8(this._index++));
  };

  tProto.getString = function(pLength, pEncoding) {
    // TODO: Support little endian?

    if (!pEncoding) {
      pEncoding = this.encoding;
    }

    var tDecoder;
    var tDecoderCache = this._decoderCache;

    if (pEncoding in tDecoderCache) {
      tDecoder = tDecoderCache[pEncoding];
    } else {
      tDecoder = tDecoderCache[pEncoding] = new Decoder(pEncoding);
    }

    var tIndex = this._index;
    var tSource = this.source;
    var tData = tSource.data;
    var tLength = pLength ? pLength : tSource.size;
    var tStringLength = pLength;

    for (var i = tIndex; i < tLength; i++) {
      if (tData[i] === 0) {
        tStringLength = i - tIndex;
        
        break;
      }
    }

    if (tStringLength === -1) {
      return null;
    } else if (tStringLength === 0) {
      this._index++;

      return '';
    } else {
      this._index += pLength || (tStringLength + 1);
      return tDecoder.decode(tSource, tIndex, tIndex + tStringLength);
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var AlphabetJS = global.AlphabetJS;
  var Reader = global.benri.io.Reader;

  var parseFloat = global.parseFloat;
  var parseInt = global.parseInt;

  /**
   * @class
   * @extends {AlphabetJS.Program}
   */
  var ASProgram = (function(pSuper) {
    function ASProgram(pFunctionMap) {
      pSuper.call(this, pFunctionMap);
      this.root = null;
      this.firstTarget = null;
      this.target = null;
      this.isTargetValid = true;
      this.isTargetReachable = true;
      this.reader = null;
      this.version = 0;
      this.stack = [];
      this.stackIndex = 0;
      this.stateStack = [];
      this.runCounter = 0;
      this.readers = [];
      this.currentASId = -1;
    }

    ASProgram.prototype = Object.create(pSuper.prototype);

    return ASProgram;
  })(AlphabetJS.Program);

  AlphabetJS.programs.AS1VM = ASProgram;
  AlphabetJS.programs.AS2VM = ASProgram;

  ASProgram.handlers = new Array(256);

  ASProgram.prototype.reset = function() {
    this.resetState();
    this.stateStack = [];
    this.runCounter = 0;
    this.root = null;
  };

  ASProgram.prototype.push = function(pValue) {
    this.stack[this.stackIndex++] = pValue;
  }

  ASProgram.prototype.pop = function() {
    return this.stack[--this.stackIndex];
  }

  ASProgram.prototype.toFloat = function(pValue) {
    if (typeof pValue === 'number') {
      return pValue;
    } else if (typeof pValue === 'boolean') {
      return pValue ? 1 : 0;
    }
    return parseFloat(pValue, 10) || 0;
  };

  ASProgram.prototype.toInt = function(pValue) {
    if (typeof pValue === 'number') {
      return pValue;
    } else if (typeof pValue === 'boolean') {
      return pValue ? 1 : 0;
    }
    return parseInt(pValue, 10) || 0;
  };

  ASProgram.prototype.toString = function(pValue) {
    if (typeof pValue === 'string') {
      return pValue;
    } else if (typeof pValue === 'number') {
      return pValue + '';
    }
    return '';
  };

  ASProgram.prototype.resetState = function() {
    this.target = null;
    this.firstTarget = null;
    this.isTargetValid = true;
    this.isTargetReachable = true;
    this.reader.seekTo(0);
    this.version = 0;
    this.stack = [];
    this.stackIndex = 0;
  }

  ASProgram.prototype.pushState = function() {
    this.stateStack.push({
      target: this.target,
      firstTarget: this.firstTarget,
      isTargetValid: this.isTargetValid,
      isTargetReachable: this.isTargetReachable,
      readerPointer: this.reader ? this.reader.tell() : 0,
      reader: this.reader,
      version: this.version,
      stack: this.stack,
      stackIndex: this.stackIndex,
      currentASId: this.currentASId
    });
  };

  ASProgram.prototype.popState = function() {
    var tState = this.stateStack.pop();
    this.target = tState.target;
    this.firstTarget = tState.firstTarget;
    this.isTargetValid = tState.isTargetValid;
    this.isTargetReachable = tState.isTargetReachable;
    var tReader = this.reader = tState.reader;

    if (tReader) {
      tReader.seekTo(tState.readerPointer);
    }
    
    this.version = tState.version;
    this.stack = tState.stack;
    this.stackIndex = tState.stackIndex;
    this.currentASId = tState.currentASId;
  };

  ASProgram.prototype.run = function(pId, pTarget, pRoot) {
    var tASData = this.loadedData[pId];

    if (tASData === void 0) {
      return;
    }

    if (this.runCounter++ !== 0) {
      this.pushState();
      this.resetState();
    }

    var tReader = this.readers[pId];

    if (!tReader) {
      tReader = this.reader = new Reader(tASData.actions);

      if ((this.version = tASData.version) <= 5) {
        tReader.encoding = 'shift_jis';
      } else {
        tReader.encoding = 'utf-8';
      }

      this.readers[pId] = tReader;
    } else {
      tReader.seekTo(0);
      this.reader = tReader;
    }

    this.currentASId = pId;
    this.root = pRoot;
    this.firstTarget = this.target = pTarget;

    var tSize = tReader.getLength();
    var tHandlers = ASProgram.handlers;

    var tActionCode;
    var tActionLength;
    var tActionHandler;

    var tResult;

    while (tReader.tell() < tSize) {
      tActionCode = tReader.getUint8();
      tActionLength = 0;

      if (tActionCode > 127) {
        tActionLength = tReader.getUint16(true);
      }

      tActionHandler = tHandlers[tActionCode];

      if (tActionHandler !== void 0) {
        tResult = tActionHandler.call(this, tActionCode, tActionLength);

        if (tResult === true) {
          continue;
        } else if (tResult === false) {
          break;
        }
      } else {
        console.warn('Unknown action code ' + tActionCode);
      }
    }

    if (--this.runCounter === 0) {
      this.reset();
    } else {
      this.popState();
    }
  };

  ASProgram.prototype.setTarget = function(pSelector) {
    if (pSelector === void 0) {
      this.target = this.firstTarget;
      this.isTargetValid = false;
      this.isTargetReachable = true;
    } else if (!pSelector) {
      this.target = this.firstTarget;
      this.isTargetValid = true;
      this.isTargetReachable = true;
    } else {
      var tNewTarget = this.GetTarget(pSelector, this.firstTarget);

      if (tNewTarget === null) {
        this.target = this.root;
        this.isTargetValid = false;
        this.isTargetReachable = false;
      } else if (tNewTarget !== this.target) {
        this.target = tNewTarget;
        this.isTargetValid = true;
        this.isTargetReachable = true;
      }
    }
  };

  ASProgram.prototype.getString = function() {
    var tReader = this.reader;
    var tLiteralTable = this.literalTables[this.currentASId];
    var tReaderIndex = tReader.tell();
    var tCachedString;
    var tFreshString;

    tCachedString = tLiteralTable[tReaderIndex];

    if (tCachedString !== void 0) {
      tReader.seekTo(tCachedString.nextIndex);

      return tCachedString.content;
    }
    
    tFreshString = tReader.getString();
    tLiteralTable[tReaderIndex] = {content: tFreshString, nextIndex: tReader.tell()};

    return tFreshString;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 AlphabetJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

 (function(global) {

  var AlphabetJS = global.AlphabetJS;
  var mHandlers = AlphabetJS.programs.AS1VM.handlers;

  var Math = global.Math;

  // End
  mHandlers[0x00] = function End(pActionCode, pActionLength) {
    return false; // break the main loop.
  };

  // NextFrame
  mHandlers[0x04] = function NextFrame(pActionCode, pActionLength) {
    this.NextFrame();
    this.Stop();
  };

  // PreviousFrame
  mHandlers[0x05] = function PreviousFrame(pActionCode, pActionLength) {
    this.PreviousFrame();
    this.Stop();
  };

  // Play
  mHandlers[0x06] = function Play(pActionCode, pActionLength) {
    this.Play();
  };

  // Stop
  mHandlers[0x07] = function Stop(pActionCode, pActionLength) {
    this.Stop();
  };

  // ToggleQuality
  mHandlers[0x08] = function ToggleQuality(pActionCode, pActionLength) {
    this.ToggleQuality();
  };

  // StopSounds
  mHandlers[0x09] = function StopSounds(pActionCode, pActionLength) {
    this.StopSounds();
  };

  // Add
  mHandlers[0x0A] = function Add(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) + this.toFloat(this.pop()));
  };

  // Subtract
  mHandlers[0x0B] = function Subtract(pActionCode, pActionLength) {
    this.push(-this.toFloat(this.pop()) + this.toFloat(this.pop()));
  };

  // Multiply
  mHandlers[0x0C] = function Multiply(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) * this.toFloat(this.pop()));
  };

  // Divide
  mHandlers[0x0D] = function Divide(pActionCode, pActionLength) {
    var tRight = this.toFloat(this.pop());
    if (tRight === 0) {
      this.pop();
      this.push('#ERROR#');
    } else {
      this.push(this.toFloat(this.pop()) / tRight);
    }
  };

  // Equals
  mHandlers[0x0E] = function Equals(pActionCode, pActionLength) {
    this.push(this.toFloat(this.pop()) === this.toFloat(this.pop()) ? 1 : 0);
  };

  // Less
  mHandlers[0x0F] = function Less(pActionCode, pActionLength) {
    // Switch it for popping purposes.
    this.push(this.toFloat(this.pop()) > this.toFloat(this.pop()) ? 1 : 0);
  };

  // And
  mHandlers[0x10] = function And(pActionCode, pActionLength) {
    var tA = this.toFloat(this.pop());
    var tB = this.toFloat(this.pop());
    this.push(tA && tB ? 1 : 0);
  };

  // Or
  mHandlers[0x11] = function Or(pActionCode, pActionLength) {
    var tA = this.toFloat(this.pop());
    var tB = this.toFloat(this.pop());
    this.push(tA || tB ? 1 : 0);
  };

  // Not
  mHandlers[0x12] = function Not(pActionCode, pActionLength) {
    this.push((!this.toFloat(this.pop())) ? 1 : 0);
  };

  // StringEquals
  mHandlers[0x13] = function StringEquals(pActionCode, pActionLength) {
    this.push(this.toString(this.pop()) === this.toString(this.pop()) ? 1 : 0);
  };

  // Pop
  mHandlers[0x17] = function Pop(pActionCode, pActionLength) {
    this.pop();
  };

  // ToInteger
  mHandlers[0x18] = function ToInteger(pActionCode, pActionLength) {
    var tNumber = this.toFloat(this.pop()) || 0;
    this.push(Math[tNumber < 0 ? 'ceil' : 'floor'](tNumber));
  };

  // GetVariable
  mHandlers[0x1C] = function GetVariable(pActionCode, pActionLength) {
    this.push(this.GetVariable(this.toString(this.pop())));
  };

  // SetVariable
  mHandlers[0x1D] = function SetVariable(pActionCode, pActionLength) {
    var tValue = this.pop();
    var tName = this.toString(this.pop());
    this.SetVariable(tName, tValue);
  };

  // StringAdd
  mHandlers[0x21] = function StringAdd(pActionCode, pActionLength) {
    var tRight = this.toString(this.pop());
    this.push(this.toString(this.pop()) + tRight);
  };

  // GetProperty
  mHandlers[0x22] = function GetProperty(pActionCode, pActionLength) {
    var tProperty = this.toInt(this.pop());
    var tName = this.toString(this.pop());
    this.push(this.GetProperty(tName, tProperty));
  };

  // SetProperty
  mHandlers[0x23] = function SetProperty(pActionCode, pActionLength) {
    var tValue = this.pop();
    var tProperty = this.toInt(this.pop());
    var tName = this.toString(this.pop());
    this.SetProperty(tName, tProperty, tValue);
  };

  // CloneSprite
  mHandlers[0x24] = function CloneSprite(pActionCode, pActionLength) {
    var tDepth = this.toInt(this.pop());
    var tTarget = this.toString(this.pop());
    var tName = this.toString(this.pop());
    this.CloneSprite(tTarget, tDepth, tName);
  };

  // RemoveSprite
  mHandlers[0x25] = function RemoveSprite(pActionCode, pActionLength) {
    var tName = this.toString(this.pop());
    this.RemoveSprite(tName);
  };

  // Trace
  mHandlers[0x26] = function Trace(pActionCode, pActionLength) {
    this.Trace(this.pop());
  };

  // StartDrag
  mHandlers[0x27] = function StartDrag(pActionCode, pActionLength) {
    this.StartDrag();
  };

  // EndDrag
  mHandlers[0x28] = function EndDrag(pActionCode, pActionLength) {
    this.EndDrag();
  };

  // StringLess
  mHandlers[0x29] = function StringLess(pActionCode, pActionLength) {
    // Switch it for popping purposes.
    this.push(this.toString(this.pop()) > this.toString(this.pop()) ? 1 : 0);
  };

  // FSCommand2
  mHandlers[0x2D] = function FSCommand2(pActionCode, pActionLength) {
    var tNumberOfArguments = (this.toInt(this.pop()) || 1) - 1;
    var tArguments = new Array(tNumberOfArguments);

    for (var i = tNumberOfArguments - 1; i >= 0; i--) {
      tArguments[i] = this.pop();
    }

    this.FSCommand2(tArguments);
  };

  // RandomNumber
  mHandlers[0x30] = function RandomNumber(pActionCode, pActionLength) {
    var tMax = this.toFloat(this.pop());
    this.push(((Math.random() * (tMax - 1)) + 0.5) | 0);
  };

  // StringLength
  mHandlers[0x14] = function StringLength(pActionCode, pActionLength) {
    var tString = this.toString(this.pop()),
        i, il, tCharCode, tLength = 0;

    for (i = 0, il = tString.length; i < il; i++) {
      tCharCode = tString.charCodeAt(i);
      if (tCharCode >= 0xff61 && tCharCode <= 0xff9f) {
        // 8bit-kana in Shift-JIS
        tLength++;
      } else if (tCharCode > 255) {
        tLength += 2;
      } else {
        tLength++;
      }
    }

    this.push(tLength);
  };

  // MBStringLength
  mHandlers[0x31] = function MBStringLength(pActionCode, pActionLength) {
    this.push(this.toString(this.pop()).length);
  };

  // CharToAscii
  mHandlers[0x32] = function CharToAscii(pActionCode, pActionLength) {
    // TODO: Support sjis
    this.push(this.toString(this.pop()).charCodeAt(0) || 0);
  };

  // AsciiToChar
  mHandlers[0x33] = function AsciiToChar(pActionCode, pActionLength) {
    // TODO: Support sjis
    this.push(String.fromCharCode(this.toInt(this.pop())));
  };

  // GetTime
  mHandlers[0x34] = function GetTime(pActionCode, pActionLength) {
    this.push(Date.now() - this.startTime);
  };

  // StringExtract
  mHandlers[0x15] = function StringExtract(pActionCode, pActionLength) {
    var tCount = this.toInt(this.pop());
    var tIndex = this.toInt(this.pop());
    var tString = this.toString(this.pop());
    var tReturn, tTempIndex, i, il, tCharCode;

    if (typeof tCount !== 'number' || typeof tIndex !== 'number') {
      this.push('');
    }

    if (tIndex <= 0) {
      tIndex = 1;
    }

    if (tCount < 0) {
      tCount = tString.length - tIndex + 1;
    }

    tReturn = '';
    tTempIndex = tIndex - 1;

    for (i = 0, il = tString.length; i < il; i++) {
      tCharCode = tString.charCodeAt(i);

      if (tCharCode > 0xFF60 && tCharCode < 0xFFA0) {
        // Halfwidth Katakana variants
        tTempIndex--;
      } else if (tCharCode > 255) {
        tTempIndex -= 2;
      } else {
        tTempIndex--;
      }

      if (tTempIndex < 0) {
        if (tCount <= 0) {
          break;
        }

        tReturn += tString.substr(i, 1);

        if (tCharCode > 0xFF60 && tCharCode < 0xFFA0) {
          // Halfwidth Katakana variants
          tCount--;
        } else if (tCharCode > 255) {
          tCount -= 2;
        } else {
          tCount--;
        }
      }
    }

    this.push(tReturn);
  };

  // MBStringExtract
  mHandlers[0x35] = function MBStringExtract(pActionCode, pActionLength) {
    var tCount = this.toInt(this.pop());
    var tIndex = this.toInt(this.pop());

    if (typeof tCount !== 'number' || typeof tIndex !== 'number') {
      this.push('');
    }

    if (tIndex <= 0) {
      tIndex = 1;
    }

    if (tCount < 0) {
      tCount = void 0;
    }

    this.push(this.toString(this.pop()).substr(tIndex - 1, tCount));
  };

  // MBCharToAscii
  mHandlers[0x36] = function MBCharToAscii(pActionCode, pActionLength) {
    // TODO: Support sjis
    this.push(this.toString(this.pop()).charCodeAt(0) || 0);
  };

  // MBAsciiToChar
  mHandlers[0x37] = function MBAsciiToChar(pActionCode, pActionLength) {
    // TODO: Support sjis
    this.push(String.fromCharCode(this.toInt(this.pop())));
  };

  // GoToFrame
  mHandlers[0x81] = function GoToFrame(pActionCode, pActionLength) {
    this.GoToFrame(this.reader.getUint16(true));
    this.Stop();
  };

  // GetURL
  mHandlers[0x83] = function GetURL(pActionCode, pActionLength) {
    // UrlString: The target URL string
    // TargetString: The target string. _level0 and _level1 loads SWF files to special area.
    this.GetURL(this.getString(), this.getString());
  };

  // WaitForFrame
  mHandlers[0x8A] = function WaitForFrame(pActionCode, pActionLength) {
    // The number of frames to wait for.
    // SkipCount: The number of actions to skip if frame is not loaded.
    this.WaitForFrame(this.reader.getUint16(true), this.reader.getUint8());
  };

  // SetTarget
  mHandlers[0x8B] = function SetTarget(pActionCode, pActionLength) {
    this.setTarget(this.getString());
  };

  // SetTarget2
  mHandlers[0x20] = function SetTarget2(pActionCode, pActionLength) {
    var tTarget = this.pop();
    if (tTarget === void 0) {
      this.setTarget(void 0);
    } else {
      this.setTarget(this.toString(tTarget));      
    }
  };

  // GoToLabel
  mHandlers[0x8C] = function GoToLabel(pActionCode, pActionLength) {
    this.GoToLabel(this.getString());
    this.Stop();
  };

  // WaitForFrame2
  mHandlers[0x8D] = function WaitForFrame2(pActionCode, pActionLength) {
    // SkipCount: The number of actions to skip if frame is not loaded.
    this.WaitForFrame2(this.reader.getUint8());
  };

  // Push
  mHandlers[0x96] = function Push(pActionCode, pActionLength) {
    var tPushValue;
    var tReader = this.reader;
    var tStartIndex = tReader.tell();
    var tType;

    while (tReader.tell() - tStartIndex < pActionLength) {
      tType = tReader.getUint8();

      switch (tType) {
        case 0: // String literal
          tPushValue = this.getString();
          break;
        case 1: // Floating Point literal
          tPushValue = tReader.getFloat32(true);
          break;
        case 4: // Register Number
          tPushValue = tReader.getUint8();
          break;
        case 5: // Boolean
          tPushValue = tReader.getUint8() ? true : false;
          break;
        case 6: // Double
          tPushValue = tReader.getFloat64(true);
          break;
        case 7: // Integer
          tPushValue = tReader.getUint32(true);
          break;
        case 8: // Constant8: For constant pool index < 256
          tPushValue = tReader.getUint8();
          break;
        case 9: // Constant16: For constant pool index >= 256
          tPushValue = tReader.getUint16(true);
          break;
        default: // Others are treated as platform specific types.
          console.warn('Unknown push type: ' + tType);
          break;
      }

      this.push(tPushValue);
    }
  };

  // Jump
  mHandlers[0x99] = function Jump(pActionCode, pActionLength) {
    var tReader = this.reader;
    tReader.seek(tReader.getInt16(true));
  };

   // GetURL2
  mHandlers[0x9A] = function GetURL2(pActionCode, pActionLength) {
    var tReader = this.reader;
    var tFlags = tReader.getUint8();
    var tLoadVariablesFlag = tFlags >>> 7; // LoadVariablesFlag (0 = no variables to load, 1 = load variables)
    var tLoadTargetFlag = (tFlags >>> 6) & 1; // LoadTargetFlag (0 = target is a browser window, 1 = target is a path to sprite)
    // Reserved 4 bits
    var tSendVarsMethod = tFlags & 3; // SendVarsMethod (0 = none, 1 = GET, 2 = POST)

    var tTarget = this.toString(this.pop());
    var tURL = this.toString(this.pop());

    this.GetURL2(tURL, tTarget, tSendVarsMethod, tLoadTargetFlag, tLoadVariablesFlag);
  };

  // If
  mHandlers[0x9D] = function If(pActionCode, pActionLength) {
    var tReader = this.reader;
    var tOffset = tReader.getInt16(true);
    var tCondition = this.toFloat(this.pop()) ? 1 : 0;

    if (tCondition) {
      tReader.seek(tOffset);
    }
  };

  // Call
  mHandlers[0x9E] = function Call(pActionCode, pActionLength) {
    this.Call(this.toString(this.pop()));
  };

  // GoToFrame2
  mHandlers[0x9F] = function GoToFrame2(pActionCode, pActionLength) {
    var tReader = this.reader;
    var tFlags = tReader.getUint8();
    // Reserved 6 bits
    var tSceneBias = (tFlags >>> 1) & 1; // SceneBiasFlag
    var tPlayFlag = tFlags & 1; // Play flag (0 = goto and stop, 1 = goto and play)

    if (tSceneBias === 1) {
      tSceneBias = tReader.getUint16(true); // SceneBias (Number to be added to frame determined by stack argument)
    }

    this.GoToFrame2(this.pop(), tSceneBias, tPlayFlag);
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  if (!('console' in global)) {
    return;
  }

  benri.impl.add('log.console', function(pData) {
    pData.add(ConsoleImpl);
  });

  function ConsoleImpl() {
    this.log = logImpl;
  }

  var log = benri.util.log;

  var mLevelMap = [];

  mLevelMap[log.LEVEL_PANIC] =
  mLevelMap[log.LEVEL_ALERT] =
  mLevelMap[log.LEVEL_CRIT] =
  mLevelMap[log.LEVEL_ERROR] = 'error';

  mLevelMap[log.LEVEL_WARN] = 'warn';

  mLevelMap[log.LEVEL_NOTICE] =
  mLevelMap[log.LEVEL_INFO] = 'info';

  mLevelMap[log.LEVEL_DEBUG] = 'debug';

  function logImpl(pLevel, pMessage, pData) {
    if (pData === void 0) {
      console[mLevelMap[pLevel]](pMessage);
    } else {
      console[mLevelMap[pLevel]](pMessage, pData);
    }
  }

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var URL = global.URL || global.webkitURL;
  var createObjectURL = URL ? URL.createObjectURL : null;
  var revokeObjectURL = URL ? URL.revokeObjectURL : revokeObjectURL;
  var GlobalBlob = global.Blob;
  var GlobalBlobBuilder = null;

  var mHaveBlob = GlobalBlob !== void 0;
  var mTypedArrayBug = /(?:iPhone|iPad).+?Version\/6/.test(global.navigator.userAgent);

  if (mHaveBlob) {
    if (mTypedArrayBug) {
      GlobalBlob = WebBlob;
    } else {
      try {
        new GlobalBlob([], {});
      } catch (e) {
        mHaveBlobConstructor = false;
        GlobalBlob = WebBlob;
        GlobalBlobBuilder = global.BlobBuilder 
            || global.WebKitBlobBuilder 
            || global.MozBlobBuilder 
            || global.MSBlobBuilder;
      }
    }
  }

  function WebBlob(pParts, pOptions) {
    var i, il, j, jl;
    var tNewArray;
    var tDataI;
    var tBuilder;
    var tBuffer, tNewBuffer;

    pParts = pParts || [];
    pOptions = pOptions || {};

    this.type = pOptions.type;

    il = pParts.length;

    if (mHaveBlob) {
      if (mTypedArrayBug) {
        var tClone = new Array(il);

        for (i = 0; i < il; i++) {
          tDataI = pParts[i];
          tBuffer = tDataI.buffer;

          if (tBuffer && tBuffer instanceof ArrayBuffer) {
            tNewArray = new Uint8Array(tDataI.byteLength);
            tNewArray.set(tDataI);

            tClone[i] = tNewArray.buffer;
          } else {
            tClone[i] = tDataI;
          }
        }

        this.blob = new Blob(tClone, pOptions);
        this.data = null;
      } else {
        tBuilder = new GlobalBlobBuilder();

        for (i = 0; i < il; i++) {
          tDataI = pParts[i];

          if (tDataI === null) continue;

          tBuffer = tDataI.buffer;

          if (tBuffer && tBuffer instanceof ArrayBuffer) {
            tNewArray = new Uint8Array(tDataI.byteLength);
            tNewArray.set(tDataI);
            tBuilder.append(tNewArray.buffer);
          } else {
            tBuilder.append(tDataI);
          }
        }

        this.blob = tBuilder.getBlob(pOptions.type);
        this.data = null;
      }
    } else {
      tBuffer = '';

      for (i = 0; i < il; i++) {
        tDataI = pParts[i];

        if (tDataI === null) continue;

        if (typeof tDataI === 'string') {
          tBuffer += tDataI;

          continue;
        } else if (global.ArrayBuffer) {
          if (tDataI instanceof ArrayBuffer) {
            tDataI = new Uint8Array(tDataI);
          } else if (tDataI.buffer && tDataI.buffer instanceof ArrayBuffer) {
            tDataI = new Uint8Array(tDataI.buffer, tDataI.byteOffset, tDataI.byteLength);
          }
        }

        for (j = 0, jl = tDataI.length; j < jl; j++) {
          tBuffer += String.fromCharCode(tDataI[j] & 0xFF);
        }
      }

      this.blob = null;
      this.data = tBuffer;
    }
  }

  function createObjectURL(pBlob) {
    if (mHaveBlob) {
      if (createObjectURL === null) {
        throw new Error('Had a Blob but no objectURL!');
      }

      return createObjectURL(pBlob instanceof Blob ? pBlob : pBlob.blob);
    }

    return 'data:' + pBlob.type + ';base64,' + global.btoa(pBlob.data);
  }

  function revokeObjectURL(pURL) {
    // Don't need to do anything.
  }

  benri.impl.web = {
    Blob: GlobalBlob,
    createObjectURL: createObjectURL,
    revokeObjectURL: revokeObjectURL
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.util = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.util.log = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.net = {};
/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.mem = {};

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.impl.add('mem.metrics', function(pData) {
    if (pData.hints.type === 'sys' || pData.hints.type === 'gc')
    pData.add(MemoryMetrics, 11);
  });

  benri.impl.web.mem.MemoryMetrics = MemoryMetrics;

  var mThreshold = 10000;

  var mVirtualHeapSize =  50000000;
  var mVirtualAllocSize =   500000;

  /**
   * @class
   * @extends {benri.mem.MemoryMetrics}
   */
  function MemoryMetrics() {
    this.mem = global.performance && global.performance.memory;
    if (!this.mem) {
      this.mem = {
        jsHeapSizeLimit : mVirtualHeapSize,
        totalJSHeapSize : mVirtualAllocSize,
        usedJSHeapSize : 0
      };
      this.useHint = true;
    }
  }

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getAll = function() {
    return this.mem.jsHeapSizeLimit;
  };
 
  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getTotal = function() {
    return this.mem.totalJSHeapSize;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getFree = function() {
    return this.mem.jsHeapSizeLimit - this.mem.usedJSHeapSize;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getUsed = function() {
    return this.mem.usedJSHeapSize;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.isTight = function(pAllocSize) {
    pAllocSize = pAllocSize || mThreshold;

    if (this.mem.jsHeapSizeLimit < this.mem.totalJSHeapSize + pAllocSize) {
      return true;
    }
    return false;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.use = function(pAmount) {
    if (this.useHint) {
      var tMem = this.mem;
      tMem.usedJSHeapSize += pAmount;
      tMem.totalJSHeapSize -= pAmount;
      if (tMem.totalJSHeapSize < 0) {
        tMem.jsHeapSizeLimit -= mVirtualAllocSize,
        tMem.totalJSHeapSize += mVirtualAllocSize;
        if (tMem.jsHeapSizeLimit < 0) {
          console.error('MemoryMetrics : System memory exhausted.');
        }
      }
    }
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  if (!('HTMLAudioElement' in global)) {
    return;
  }

  var MediaRenderer = benri.media.MediaRenderer;

  var STATE_NOT_READY = MediaRenderer.PLAYBACK_STATE_NOT_READY;
  var STATE_READY = MediaRenderer.PLAYBACK_STATE_READY;
  var STATE_PLAYING = MediaRenderer.PLAYBACK_STATE_PLAYING;
  var STATE_PAUSED = MediaRenderer.PLAYBACK_STATE_PAUSED;

  /**
   * @class
   * @extends {benri.media.audio.AudioRenderer}
   */
  var HTMLAudioRenderer = (function(pSuper) {
    function HTMLAudioRenderer(pAudioData) {
      pSuper.call(this, pAudioData);
      this.options = null;
      var tElem = this.element = this.audio.data;
      var tSelf = this;
      tElem.addEventListener('ended', function () {
        tSelf.playbackState = STATE_READY;
        tSelf.emit('ended');
      }, false);

    }

    HTMLAudioRenderer.prototype = Object.create(pSuper.prototype);
    HTMLAudioRenderer.prototype.constructor = HTMLAudioRenderer;

    return HTMLAudioRenderer;
  })(benri.media.audio.AudioRenderer);

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.play = function(pOptions) {
    var tOptions = this.options = pOptions || {},
        tElem = this.element;

    if (this.playbackState === STATE_PAUSED) {
      this.resume();
    } else {
      if (tOptions.startTime) {
        tElem.currentTime = tOptions.startTime / 1000;
      }
      if (tOptions.loop) {
        tElem.loop = true;
      }
      tElem.play();
      this.playbackState = STATE_PLAYING;
    }
    this.emit('started');
  };

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.stop = function() {
    var tOptions = this.options || {},
        tElem = this.element;

    tElem.pause();
    tElem.currentTime = tOptions.startTime || 0;
    this.options = null;
    this.playbackState = STATE_READY;
    this.emit('stopped');
  };

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.pause = function() {
    this.element.pause();
    this.playbackState = STATE_PAUSED;
    this.emit('stopped');
  };

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.resume = function() {
    this.element.play();
    this.playbackState = STATE_PLAYING;
    this.emit('started');
  };

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.seekTo = function(pTime) {
    this.element.fastSeek(pTime / 1000);
    this.emit('seeked');
  };

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.getPlaybackTime = function() {
    return this.element.currentTime * 1000;
  };

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.getVolume = function() {
    return this.element.volume;
  };

  /**
   * @override
   */
  HTMLAudioRenderer.prototype.setVolume = function(pVolume) {
    this.element.volume = pVolume;
  };

  benri.impl.add('media.audio.AudioRenderer', function(pEvent) {
    pEvent.add(HTMLAudioRenderer, 11);
  });

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.io = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.io.compression = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  benri.impl.web.io.compression.DeflateInflator = DeflateInflator;
  benri.impl.web.io.compression.DeflateDeflator = DeflateDeflator;

  benri.impl.add('io.compression.inflator.inflate', function(pEvent) {
    global.Zlib && global.Zlib.Inflate && pEvent.add(DeflateInflator, 11);
  });

  benri.impl.add('io.compression.deflator.deflate', function(pEvent) {
    global.Zlib && global.Zlib.Deflate && pEvent.add(DeflateDeflator, 11);
  });

  var mInflatorProto = {
    inflate: function(pBuffer, pOptions) {
      pOptions = pOptions || {};
      pOptions.resize = true;

      var tInflator = new Zlib[this.type](pBuffer.data, pOptions);
      return benri.io.Buffer.fromArray(tInflator.decompress());
    }
  };

  var mDeflatorProto = {
    deflate: function(pBuffer, pOptions) {
      pOptions = pOptions || {};
      pOptions.resize = true;

      var tDeflator = new Zlib[this.type](pBuffer.data, pOptions);
      return benri.io.Buffer.fromArray(tInflator.compress());
    }
  };

  function DeflateInflator() {
    this.type = 'Inflate';
  }
  DeflateInflator.prototype = Object.create(mInflatorProto);

  function DeflateDeflator() {
    this.type = 'Deflate';
  }
  DeflateDeflator.prototype = Object.create(mDeflatorProto);

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  var mErrorChar = String.fromCharCode(0xFFFD);

  benri.impl.add('text.decoder.utf-8', function(pEvent) {
    pEvent.add(UTF8Decoder, 10);
  });

  function UTF8Decoder() {

  }

  UTF8Decoder.prototype.decode = function(pBuffer, pOffset, pEndIndex) {
    // http://encoding.spec.whatwg.org/#utf-8-decode

    var tBytePointer = pOffset;
    var tStreamLength = pEndIndex - pOffset;
    var tCodePoint = 0;
    var tBytesSeen = 0;
    var tBytesNeeded = 0;
    var tLowerBoundary = 0x80;
    var tUpperBoundary = 0xBF;
    var tByte;
    var tError = mErrorChar;
    var tData = pBuffer.data;

    var tOutput = '';

    if (tStreamLength >= 3 &&
        tData[0] === 0xEF &&
        tData[1] === 0xBB &&
        tData[2] === 0xBF) {
      tBytePointer = 3;
    }

    while (true) {
      if (tBytePointer === pEndIndex) {
        if (tBytesNeeded !== 0) {
          tBytesNeeded = 0;
          tOutput += tError;
          continue;
        } else {
          break;
        }
      }

      tByte = tData[tBytePointer++];

      if (tBytesNeeded === 0) {
        if (tByte <= 0x7F) {
          tOutput += String.fromCharCode(tByte);
          continue;
        } else if (tByte >= 0xC2 && tByte <= 0xDF) {
          tBytesNeeded = 1;
          tCodePoint = tByte - 0xC0;
        } else if (tByte >= 0xE0 && tByte <= 0xEF) {
          if (tByte === 0xE0) {
            tLowerBoundary = 0xA0;
          } else if (tByte === 0xED) {
            tUpperBoundary = 0x9F;
          }

          tBytesNeeded = 2;
          tCodePoint = tByte - 0xE0;
        } else if (tByte >= 0xF0 && tByte <= 0xF4) {
          if (tByte === 0xF0) {
            tLowerBoundary = 0x90;
          } else if (tByte === 0xF4) {
            tUpperBoundary = 0x8F;
          }

          tBytesNeeded = 3;
          tCodePoint = tByte - 0xF0;
        } else {
          tOutput += tError;
          continue;
        }

        tCodePoint = tCodePoint * Math.pow(64, tBytesNeeded);
        continue;
      }

      if (tByte < tLowerBoundary || tByte > tUpperBoundary) {
        tCodePoint = 0;
        tBytesNeeded = 0;
        tBytesSeen = 0;
        tLowerBoundary = 0x80;
        tUpperBoundary = 0xBF;

        tBytePointer--;

        tOutput += tError;
        continue;
      }

      tLowerBoundary = 0x80;
      tUpperBoundary = 0xBF;
      tBytesSeen++;

      tCodePoint = tCodePoint + ((tByte - 0x80) * Math.pow(64, (tBytesNeeded - tBytesSeen)));

      if (tBytesSeen !== tBytesNeeded) {
        continue;
      }

      tOutput += String.fromCharCode(tCodePoint);

      tCodePoint = 0;
      tBytesNeeded = 0;
      tBytesSeen = 0;
    }

    return tOutput;
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  var mErrorChar = String.fromCharCode(0xFFFD);

  benri.impl.add('text.decoder.shift_jis', function(pEvent) {
    pEvent.add(ShiftJISDecoder, 10);
  });

  function ShiftJISDecoder() {

  }

  ShiftJISDecoder.prototype.decode = function(pBuffer, pOffset, pEndIndex) {
    var tShiftJISLead = 0;
    var tLead = 0;
    var tBytePointer = pOffset;
    var tPointer = null;
    var tByte;
    var tString = '';
    var tOffset = 0;
    var tLeadOffset;
    var tMap = mMap;
    var tData = pBuffer.data;

    while (true) {
      if (tBytePointer === pEndIndex) {
        if (tShiftJISLead === 0) {
          break; // done
        } else {
          tString += mErrorChar; // error
          break;
        }
      }

      tByte = tData[tBytePointer];
      tBytePointer++;

      if (tShiftJISLead !== 0) {
        tLead = tShiftJISLead;
        tPointer = null;
        tShiftJISLead = 0;

        if (tByte < 0x7F) {
          tOffset = 0x40;
        } else {
          tOffset = 0x41;
        }

        if (tLead < 0xA0) {
          tLeadOffset = 0x81;
        } else {
          tLeadOffset = 0xC1;
        }

        if ((tByte >= 0x40 && tByte <= 0x7E) || (tByte >= 0x80 && tByte <= 0xFC)) {
          tPointer = (tLead - tLeadOffset) * 188 + tByte - tOffset;
        }

        if (tPointer === null) {
          tString += mErrorChar; // error
        } else {
          tString += tMap[tPointer];
        }

        continue;
      }

      if (tByte >= 0 && tByte <= 0x80) {
        tString += String.fromCharCode(tByte);
      } else if (tByte >= 0xA1 && tByte <= 0xDF) {
        tString += String.fromCharCode(0xFF61 + tByte - 0xA1);
      } else if ((tByte >= 0x81 && tByte <= 0x9F) || (tByte >= 0xE0 && tByte <= 0xFC)) {
        tShiftJISLead = tByte;
      } else {
        tString += mErrorChar; // error
      }
    }

    return tString;
  };

  var mMap = '　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈〉《》「」『』【】＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓           ∈∋⊆⊇⊂⊃∪∩        ∧∨￢⇒⇔∀∃           ∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬       Å‰♯♭♪†‡¶    ◯               ０１２３４５６７８９       ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ      ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ    ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをん           ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ        ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ        αβγδεζηθικλμνξοπρστυφχψω                                      АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ               абвгдеёжзийклмнопрстуфхцчшщъыьэюя             ─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂                                                                                                                                                                                                                                                                                                                                                                                                                                                      ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ ㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡        ㍻〝〟№㏍℡㊤㊥㊦㊧㊨㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪                                                                                                                                                                                              亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕                                           弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙                                                                                                                                                                                                                                                                                                                                                                                                                                                                                纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑  ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹ￢￤＇＂                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑';

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  benri.impl.add('text.encoder.ascii', function(pEvent) {
    pEvent.add(ASCIIDecoder, 10);
  });

  function ASCIIEncoder() {

  }

  ASCIIEncoder.prototype.encode = function(pString) {
    var tLength = pString.length;
    var tBuffer = benri.io.Buffer.create(tLength);
    var tData = tBuffer.data;

    for (var i = 0; i < tLength; i++) {
      tData[i] = pString.charCodeAt(i) & 0xFF;
    }

    return tBuffer;
  };

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.impl.add('text.decoder.ascii', function(pEvent) {
    pEvent.add(ASCIIDecoder, 10);
  });

  function ASCIIDecoder() {

  }

  ASCIIDecoder.prototype.decode = function(pBuffer, pOffset, pEndIndex) {
    var tString = '';
    var tData = pBuffer.data;

    for (; pOffset < pEndIndex; pOffset++) {
      tString += String.fromCharCode(tData[pOffset]);
    }

    return tString;
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.shared = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.shared.text = {};
/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  benri.impl.add('mem.metrics', function(pData) {
    if (pData.hints.type === 'native') {
      pData.add(MemoryMetrics, 10);
    }
  });

  /**
   * @class
   * @extends {benri.mem.MemoryMetrics}
   */
  function MemoryMetrics() {
  }

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getAll = function() {
    // TODO: Need to implement.
    return 0;
  };
 
  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getTotal = function() {
    // TODO: Need to implement.
    return 0;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getFree = function() {
    // TODO: Need to implement.
    return 0;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.getUsed = function() {
    // TODO: Need to implement.
    return 0;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.isTight = function(pAllocSize) {
    // TODO: Need to implement.
    return false;
  };

  /**
   * @inheritDoc
   */
  MemoryMetrics.prototype.use = function(pAmount) {
    // TODO: Need to implement.
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

if ('Uint8Array' in this) {
  benri.impl.add('io.buffer', function(pEvent) {
    var mHaveSlice = ArrayBuffer.prototype.slice !== void 0;

    pEvent.add({
      create: function(pSize) {
        return new Uint8Array(pSize);
      },

      copyTo: function(pBuffer, pOffset, pEndOffset) {
        if (mHaveSlice) {
          return new Uint8Array(pBuffer.buffer.slice(pOffset, pEndOffset));
        }

        var tArray = new Uint8Array(pEndOffset - pOffset);
        tArray.set(pBuffer.subarray(pOffset, pEndOffset));

        return tArray;
      },

      fromArray: function(pArray) {
        var tNewBuffer;
        var tLength;
        var i;

        if (pArray instanceof Uint8Array) {
          return pArray;
        } else if (pArray instanceof ArrayBuffer || (pArray.buffer && pArray.buffer instanceof ArrayBuffer)) {
          return new Uint8Array(pArray);
        }

        tLength = pArray.length;
        tNewBuffer = new Uint8Array(tLength);

        for (i = 0; i < tLength; i++) {
          tNewBuffer[i] = pArray[i] & 0xFF;
        }

        return tNewBuffer;
      },

      fromParts: function(pParts) {
        
      },

      copyFrom: function(pDestBuffer, pSourceBuffer, pDestOffset, pSourceOffset, pSize) {
        if (pSourceOffset !== 0 || pSize !== 0) {
          pSourceBuffer = new Uint8Array(pSourceBuffer, pSourceOffset, pSize);
        }

        pDestBuffer.set(pSourceBuffer, pDestOffset);
      }
    }, 12);
  });
}
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.add('io.buffer', function(pEvent) {
  pEvent.add({
    create: function(pSize) {
      return new Array(pSize);
    },

    copyTo: function(pBuffer, pOffset, pEndOffset) {
      var tNewBuffer = new Array(pEndOffset - pOffset);

      for (var i = pOffset, j = 0; i < pEndOffset; i++, j++) {
        tNewBuffer[j] = pBuffer[i];
      }

      return tNewBuffer;
    },

    fromArray: function(pArray) {
      return pArray;
    },

    fromParts: function(pParts) {

    },

    copyFrom: function(pDestBuffer, pSourceBuffer, pDestOffset, pSourceOffset, pSize) {
      pDestOffset = pDestOffset || 0;
      pSourceOffset = pSourceOffset || 0;
      pSize = pSize || pSourceBuffer.length;

      for (var i = 0; i < pSize; i++, pDestOffset++, pSourceOffset++) {
        tDestBuffer[pDestOffset] = pSourceBuffer[pSourceOffset];
      }
    }
  }, 11);
});
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /*
    Surface Rules.

    * Whenever a target of ID 0 is used, that means
      to use the default Target (usually the screen)
  */

  var getImpl = benri.impl.get;

  benri.graphics.Surface = Surface;

  Surface.createSurface = function(pWidth, pHeight, pSurfaceHints, pImplHints) {
    return new (getImpl('graphics.surface', pImplHints).best)(pWidth || 1, pHeight || 1, pSurfaceHints);
  };

  function Surface(pWidth, pHeight, pHints) {
    this.width = pWidth;
    this.height = pHeight;
    this.hints = pHints || {};
  }

  var tProto = Surface.prototype;

  /**
   * Namespace holding all the
   * supported flags for Surfaces.
   *
   * All Surfaces must adhere to the
   * default values pointed out in code
   * comments below. true means it is
   * enabled by default while false
   * means it is disabled by default.
   * @type {Object}
   */
  Surface.flag = {
    /**
     * If true, the Surface will apply
     * antialias to all images created
     * via it.
     *
     * Default is false.
     * @type {number}
     */
    ANTIALIAS: 0x100,

    FRAGMENTS: 0x200,

    STENCIL_TEST: 0x300,

    STENCIL_SAVE: 0x1000
  };

  tProto.enable = function(pFlag) {

  };

  tProto.disable = function(pFlag) {

  };

  tProto.scissor = function(pX, pY, pWidth, pHeight) {

  };

  tProto.image = function(pImage, pDestRect, pSrcRect, pProgram) {

  };

  tProto.fastImage = function(pImage, pProgram) {

  };

  tProto.text = function(pText, pStyle, pProgram) {

  };

  tProto.clearColor = function(pColor) {

  };

  /**
   * Creates a new target to render to.
   * As a special rule, passing -1 to either
   * pWidth or pHeight means to use the current
   * targets size instead.
   * @param  {number} pWidth  The width of the target
   * @param  {number} pHeight The height of the target
   * @param  {Object} pAttachments Attachments for this target.
   * @return {number}         The ID of the target
   */
  tProto.createTarget = function(pWidth, pHeight, pAttachments) {

  };

  tProto.destroyTarget = function(pId) {

  };

  tProto.setTarget = function(pId) {

  };

  tProto.getTarget = function() {

  };

  tProto.target = function(pId) {

  };

  /**
   * Attaches information to a target.
   * The data to attach has some rules and
   * also allows arbitrary implementation-specific
   * data if needed.
   *
   * pAttachments must be an object.
   * If you want to unattach data, set the data
   * to null.
   *
   * All surfaces must support setting the property
   * 'fragments'. 'fragments' must be an array.
   * Each value in the array must be a Texture or null.
   * Index 0 is always the main target (usually the screen).
   * The main target may be null.
   * Depending on the platform, rendering to multiple
   * fragment targets could be slow as it depends on the
   * hardware/api's if it is supported. If it is not
   * supported all surfaces must manually support
   * rendering to the targets correctly.
   *
   * Other keys in pAttachments are implementation-dependant.
   *
   * TODO: Support RenderBuffer-style objects as well as Textures.
   * @param  {number} pId          The ID of the target to attach to
   * @param  {Object} pAttachments The attachments.
   */
  tProto.attachToTarget = function(pId, pAttachments) {

  };

  tProto.getTargetAttachments = function(pId) {

  };

  tProto.getTargetWidth = function(pId) {

  };

  tProto.getTargetHeight = function(pId) {

  };

  tProto.registerTexture = function(pTexture) {

  };

  tProto.setTextureImage = function(pTexture, pImage) {

  };

  tProto.setTextureBytes = function(pTexture, pBytes, pX, pY, pWidth, pHeight, pStride) {

  };

  tProto.getTextureBytes = function(pTexture, pX, pY, pWidth, pHeight, pStride) {

  };

  tProto.destroyTexture = function(pTexture) {

  };

  tProto.render = function(
    pVerticies,
    pFillType,
    pFillData,
    pProgram) {

  };

  tProto.getImage = function(pId) {

  };

  tProto.destroy = function() {

  };

  tProto.flush = function() {

  };

}(this));
/**
 * @author Kuu Miyazaki
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var graphics = benri.graphics;

  graphics.Records = Records;

  var deepCopy = benri.util.deepCopy;
  var Keeper = benri.mem.Keeper;
  var Matrix2D = benri.geometry.Matrix2D;

  var NOOP = Records.NOOP = 0x0;

  var UNIFORMS = Records.UNIFORMS = 1 << 7;
  var GLOBALUNIFORMS = Records.GLOBALUNIFORMS = (1 << 7) + 1;
  var UNIFORM = Records.UNIFORM = (1 << 7) + 2;
  var MATRIX = Records.MATRIX = (1 << 7) + 3;

  var ENABLE = Records.ENABLE = (1 << 7) + 16;
  var DISABLE = Records.DISABLE = (1 << 7) + 17;
  var PUSHFLAGS = Records.PUSHFLAGS = (1 << 7) + 18;
  var POPFLAGS = Records.POPFLAGS = (1 << 7) + 19;

  var RECORDS = Records.RECORDS = (1 << 7) + 24;
  var CALLBACK = Records.CALLBACK = (1 << 7) + 25;

  var IMAGE = Records.IMAGE = 1 << 6;
  var FASTIMAGE = Records.FASTIMAGE = (1 << 6) + 1;

  var POINT = Records.POINT = 1 << 5;
  var PATH = Records.PATH = (1 << 5) + 1;
  var POLYGON = Records.POLYGON = (1 << 5) + 2;

  var TEXT = Records.TEXT = 1 << 4;

  var CREATETARGET = Records.CREATETARGET = 1 << 3;
  var SETTARGET = Records.SETTARGET = (1 << 3) + 1;
  var DESTROYTARGET = Records.DESTROYTARGET = (1 << 3) + 2;
  var TARGET = Records.TARGET = (1 << 3) + 3;
  var ATTACHTOTARGET = Records.ATTACHTOTARGET = (1 << 3) + 4;

  var FILL = Records.FILL = 1 << 2;
  var STROKE = Records.STROKE = (1 << 2) + 1;
  var RAW = Records.RAW = (1 << 2) + 2;

  var CLEARCOLOR = Records.CLEARCOLOR = 1 << 1;
  var CLEARDATA = Records.CLEARDATA = (1 << 1) + 1;

  var PROGRAM = Records.PROGRAM = 1 << 0;


  // Link Records flags to Surface flags.
  Records.flag = graphics.Surface.flag;

  /**
   * A class that encapsulates draw command records and provides methods to access it.
   * @class
   * @constructor
   */
  function Records(pCommands, pImageKeeperMap, pProgramKeeperMap) {

    /**
     * Draw commands
     * @type {Array}
     */
    this.commands = pCommands || [];

    /**
     * Holds images currently being kept by this Records object.
     * @private
     * @type {Array.<Object>}
     */
    this._images = pImageKeeperMap || [];

    /**
     * Holds images currently being kept by this Records object.
     * @private
     * @type {Array.<Object>}
     */
    this._programs = pProgramKeeperMap || [];

    /**
     * Holds matrices currently being kept by this Records object.
     * @private
     * @type {Array.<Object>}
     */
    this._matrices = [];

    this.prevInsertedProgram = null;

    this._targetCounter = 0;

    this._currentTarget = 0;

    Keeper(this);

    this.on('destroy', onDestroy);
  }

  function onDestroy(pData, pTarget) {
    pTarget.reset();
  }

  var tProto = Records.prototype;

  tProto.program = function(pProgram) {
    if (pProgram !== this.prevInsertedProgram || pProgram === null) {
      this.commands.push({
        type: PROGRAM,
        program: pProgram
      });
 
      this.keepProgram(pProgram);
      this.prevInsertedProgram = pProgram;
    }
  };

  tProto.enable = function(pFlag) {
    this.commands.push({
      type: ENABLE,
      flag: pFlag
    });
  };

  tProto.disable = function(pFlag) {
    this.commands.push({
      type: DISABLE,
      flag: pFlag
    });
  };

  tProto.pushFlags = function(pFlags) {
    this.commands.push({
      type: PUSHFLAGS,
      flags: pFlags
    });
  };

  tProto.popFlags = function() {
    this.commands.push({
      type: POPFLAGS
    });
  };

  tProto.records = function(pRecords) {
    this.commands.push({
      type: RECORDS,
      records: pRecords
    });
  };

  tProto.callback = function(pCallback) {
    this.commands.push({
      type: CALLBACK,
      callback: pCallback
    });
  };

  tProto.fastImage = function(pImage) {
    this.commands.push({
      type: FASTIMAGE,
      image: pImage
    });

    this.keepImage(pImage);
  };

  tProto.image = function(pImage, pWidth, pHeight, pDestRect, pSourceRect) {
    this.commands.push({
      type: IMAGE,
      image: pImage,
      width: pWidth,
      height: pHeight,
      srcRect: pSourceRect
    });

    this.keepImage(pImage);
  };

  tProto.matrix = function(pMatrix) {
    this._matrices.push(pMatrix);

    this.commands.push({
      type: MATRIX,
      matrix: pMatrix
    });
  };

  tProto.uniform = function(pName, pValue) {
    this.commands.push({
      type: UNIFORM,
      name: pName,
      value: pValue
    });

    if (pValue && pValue.constructor === Matrix2D) {
      this._matrices.push(pValue);
    }
  };

  tProto.uniforms = function(pMap) {
    this.commands.push({
      type: UNIFORMS,
      map: pMap
    });

    this._saveMatrix(pMap);
  };

  tProto.globalUniforms = function(pMap) {
    this.commands.push({
      type: GLOBALUNIFORMS,
      map: pMap
    });

    //this._saveMatrix(pMap);
  };

  tProto.point = function(pPoint, pDataType) {
    this.commands.push({
      type: POINT,
      point: pPoint,
    });
  };

  tProto.path = function(pPath, pDataType) {
    this.commands.push({
      type: PATH,
      path: pPath,
    });
  };

  tProto.polygon = function(pPolygon, pDataType) {
    this.commands.push({
      type: POLYGON,
      polygon: pPolygon,
    });
  };

  tProto.text = function(pText, pTextStyle) {
    this.commands.push({
      type: TEXT,
      text: pText,
      style: pTextStyle
    });
  };

  tProto.fill = function() {
    this.commands.push({
      type: FILL,
      data: null
    });
  };

  tProto.stroke = function(pStrokeStyle) {
    this.commands.push({
      type: STROKE,
      data: pStrokeStyle || {width: 1, cap: 'round', join: 'round'}
    });
  };

  tProto.clearColor = function(pColor) {
    this.commands.push({
      type: CLEARCOLOR,
      color: pColor
    });
  };

  tProto.clearData = function() {
    this.commands.push({
      type: CLEARDATA
    });
  };

  tProto.createTarget = function(pWidth, pHeight, pData) {
    var tId = ++this._targetCounter;

    this.commands.push({
      type: CREATETARGET,
      id: tId,
      width: pWidth,
      height: pHeight,
      data: pData
    });

    return tId;
  };

  tProto.setTarget = function(pId) {
    this.commands.push({
      type: SETTARGET,
      id: pId
    });

    this._currentTarget = pId;
  };

  tProto.getTarget = function() {
    return this._currentTarget;
  };

  tProto.destroyTarget = function(pId) {
    this.commands.push({
      type: DESTROYTARGET,
      id: pId
    });
  };

  tProto.target = function(pId) {
    this.commands.push({
      type: TARGET,
      id: pId
    });
  };

  tProto.attachToTarget = function(pId, pAttachments) {
    this.commands.push({
      type: ATTACHTOTARGET,
      id: pId,
      attachments: pAttachments
    });
  };

  tProto.keepImage = function(pImage) {
    if (pImage) {
      this._images.push({
        image: pImage,
        key: pImage.keep()
      });
    }
  };

  tProto.keepProgram = function(pProgram) {
    if (pProgram) {
      this._programs.push({
        program: pProgram,
        key: pProgram.keep()
      });
    }
  };

  tProto.reset = function() {
    var tImages = this._images;
    var tPrograms = this._programs;
    var i, il;

    for (i = 0, il = tImages.length; i < il; i++) {
      tImages[i].image.release(tImages[i].key);
    }

    tImages.length = 0;

    for (i = 0, il = tPrograms.length; i < il; i++) {
      tPrograms[i].program.release(tPrograms[i].key);
    }

    tPrograms.length = 0;

    this.commands.length = 0;

    this._targetCounter = 0;

    this._currentTarget = 0;

    this._resetMatrices();
  };

  tProto.getPrograms = function() {
    var tProgramKeeperMap = this._programs;
    var il = tProgramKeeperMap.length;
    var tPrograms = new Array(il);

    for (var i = 0; i < il; i++) {
      tPrograms[i] = tProgramKeeperMap[i].program;
    }

    return tPrograms;
  };

  /**
   * Concatenate records.
   * @param {benri.graphics.Records} pRecord Records to be appended to this record.
   */
  tProto.concat = function(pRecords) {
    var tImages = pRecords._images;
    var tPrograms = pRecords._programs;
    var i, il;

    var tTargetIdOffset = this._targetCounter;

    i = this.commands.length;

    var tCommands = this.commands = this.commands.concat(pRecords.commands);
    var tCommand;
    var tCurrentTarget = this._currentTarget;

    // Need to update target IDs.
    for (il = tCommands.length; i < il; i++) {
      tCommand = tCommands[i];

      if ((tCommand.type & CREATETARGET) === CREATETARGET) {
        // This is a target related command.
        tCommand = tCommands[i] = deepCopy(tCommand);
        tCommand.id += tTargetIdOffset;

        if (tCommand.type === SETTARGET) {
          tCurrentTarget = tCommand.id;
        }
      }
    }

    this._targetCounter += pRecords._targetCounter;
    this._currentTarget = tCurrentTarget;

    for (i = 0, il = tImages.length; i < il; i++) {
      this.keepImage(tImages[i].image);
    }

    for (i = 0, il = tPrograms.length; i < il; i++) {
      this.keepProgram(tPrograms[i].program);
    }
  };

  tProto.execute = function(pSurface, pGlobalUniforms) {
    var tCommandsStack = [this.commands, 0, 0, this.commands.length, null];
    var tCommands;
    var tCommand;
    var tType;
    var tProgram;
    var tData;
    var tStartIndex;
    var tTargetMap = [0];
    var tFlagsStack = [];
    var i, il;
    var tGlobalUniformsAccessTable = {};
    var tMatrix = Matrix2D.obtain();

    pGlobalUniforms = pGlobalUniforms || {};

    do {
      tCommands = tCommandsStack.shift();
      tStartIndex = tCommandsStack.shift();
      i = tCommandsStack.shift();
      il = tCommandsStack.shift();
      tProgram = tCommandsStack.shift();

      for (; i < il; i++) {
        tCommand = tCommands[i];
        tType = tCommand.type;

        if (tType === RECORDS) {
          if (tProgram === null && tStartIndex !== i) {
            // Only execute when we have commands to execute.
            tProgram = new graphics.Program();
            tProgram.matrix = tMatrix;
          }

          if (tStartIndex !== i) {
            tProgram.execute(tCommands.slice(tStartIndex, i), tTargetMap, tFlagsStack, pSurface, pGlobalUniforms, tGlobalUniformsAccessTable);
            tMatrix = tProgram.matrix;
          }

          tCommandsStack.push(tCommands, i + 1, i + 1, il, tProgram);

          tCommands = tCommand.records.commands;
          tStartIndex = 0;
          i = -1;
          il = tCommands.length;

          continue;
        } else if (tType === PROGRAM) {
          if (tProgram === null && tStartIndex !== i) {
            // Only execute when we have commands to execute.
            tProgram = new graphics.Program();
            tProgram.matrix = tMatrix;
          }

          if (tStartIndex !== i) {
            tProgram.execute(tCommands.slice(tStartIndex, i), tTargetMap, tFlagsStack, pSurface, pGlobalUniforms, tGlobalUniformsAccessTable);
            tMatrix = tProgram.matrix;
          }

          tProgram = tCommand.program;

          if (tProgram !== null) {
            tProgram.matrix = tMatrix;
          }

          tStartIndex = i + 1;
        }
      }

      if (tStartIndex === il) {
        continue;
      }

      if (tProgram === null) {
        tProgram = new graphics.Program();
        tProgram.matrix = tMatrix;
      }

      tProgram.execute(tCommands.slice(tStartIndex), tTargetMap, tFlagsStack, pSurface, pGlobalUniforms, tGlobalUniformsAccessTable);
      tMatrix = tProgram.matrix;

      this.prevInsertedProgram = null;
    } while (tCommandsStack.length !== 0);
  };

  tProto.getLength = function() {
    return this.commands.length;
  };

  tProto._saveMatrix = function(pUniforms) {
    var tUniform, k;

    for (k in pUniforms) {
      tUniform = pUniforms[k];
      if (tUniform.constructor === Matrix2D) {
        this._matrices.push(tUniform);
      }
    }
  };

  tProto._resetMatrices = function() {
    var tMatrices = this._matrices;

    for (var i = 0, il = tMatrices.length; i < il; i++) {
      tMatrices[i].recycle();
    }

    tMatrices.length = 0;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Records = global.benri.graphics.Records;

  theatre.crews.swf.render.renderPropOnRenderable = onRenderable;
  theatre.crews.swf.render.renderPropOnPreRender = onPreRender;
  theatre.crews.swf.render.renderPropOnPostRender = onPostRender;
  theatre.crews.swf.render.renderPropOnFinalizeRender = onFinalizeRender;
  theatre.crews.swf.render.renderPropOnStartCache = onStartCache;
  theatre.crews.swf.render.renderPropOnFinishCache = onFinishCache;
  theatre.crews.swf.render.renderPropOnRenderCache = onRenderCache;

  function onRenderable(pPackage, pTarget) {
    var tActor = pTarget.actor;
    var tRenderable = pPackage.renderable = tActor.data.renderable;

    tRenderable.ratio = tActor.ratio;

    tActor.player.compositor.updateShaders();
  }

  function onPreRender(pPackage, pTarget) {
    var tActor = pTarget.actor;
    var tPlayer = tActor.player;
    var tCompositor = tPlayer.compositor;
    var tRenderableManager = tPlayer.renderableManager;
    var tColorTransform = tActor.colorTransform;
    var tClipDepth = tActor.clipDepth;
    var tRenderable = tActor.data.renderable;
    var tNextSibling, tCurrentMaskUntil;
    var tRenderData;

    if (tColorTransform !== null) {
      // Update the current color transform
      tCompositor.saveState();
      tCompositor.updateColorTransform(tColorTransform);
    }

    if (tActor.props.renderCache !== void 0) {
      tActor.props.renderCache.updateHash(tCompositor.state.colorTransformHash);
    }

    if (tRenderable !== null) {
      if (tClipDepth > 0) {
        tNextSibling = tActor.node.nextSibling;

        if (tNextSibling !== null && tNextSibling.actor.layer <= tClipDepth) {
          // This actor is a mask to actors
          // until clipDepth layers later
          tCurrentMaskUntil = tActor.parent.data.maskUntil;

          if (tCurrentMaskUntil) {
            tCurrentMaskUntil.push(tClipDepth);
          } else {
            tActor.parent.data.maskUntil = [tClipDepth];
          }
          
          tRenderData = tRenderable.renderData;

          if (tRenderData.maskRecords === null) {
            tRenderData.maskRecords = tRenderable.records = getMaskRecords(tRenderData);
          } else {
            tRenderable.records = tRenderData.maskRecords;
          }
          
          tCompositor.startClipping();
        } else {
          // There is nothing to mask. Abort.
          pPackage.stop();

          return;
        }
      } else {
        tRenderable.records = tRenderable.renderData.records;
      }
    }
  }

  function onPostRender(pPackage, pTarget) {
    var tActor = pTarget.actor;

    if (tActor.colorTransform !== null) {
      tActor.player.compositor.restoreState();
    }
  }

  function onFinalizeRender(pPackage, pTarget) {
    var tActor = pTarget.actor;

    if (tActor.colorTransform !== null && pTarget.isVisible === true) {
      tActor.player.compositor.restoreState();
    }

    if (tActor.parent.data.maskUntil) {
      if (tActor.clipDepth > 0) {
        // We started a mask in render() and
        // we we did not abort the preRender,
        // we tell the compositor that our mask
        // image is complete to and start masking
        // everything from now on.
        tActor.player.compositor.clipRenderables();
      } else {
        // Otherwise, check if we are currently masking
        // and check if we need to finish masking
        endMaskIfDone(tActor);
      }
    }
  }

  function onStartCache(pPackage, pTarget) {
    var tCompositor = pTarget.actor.player.compositor;
    var tColorTransform = tCompositor.state.colorTransform;

    if (tColorTransform !== null) {
      // Reset alpha multilply because apply it
      // after caching for performance reasons.
      tCompositor.saveState();

      tColorTransform = tColorTransform.clone();
      tColorTransform.alphaMult = 1;
      tColorTransform.update();

      tCompositor.setColorTransform(tColorTransform);
    }
  }

  function onFinishCache(pPackage, pTarget) {
    var tCompositor = pTarget.actor.player.compositor;

    if (tCompositor.state.colorTransform !== null) {
      tCompositor.restoreState();
    }
  }

  function onRenderCache(pPackage, pTarget) {
    pTarget.actor.player.compositor.updateShaders();
  }

  function endMaskIfDone(pActor) {
    var tParent = pActor.parent;
    var tMaskUntilStack = tParent.data.maskUntil;

    if (tMaskUntilStack) {
      var tCompositor = pActor.player.compositor;
      var tIndex = tMaskUntilStack.length;
      var tMaskUntil;
      var tNextSibling = pActor.node.nextSibling;

      while (tIndex--) {
        tMaskUntil = tMaskUntilStack[tIndex];

        if (tNextSibling === null || tNextSibling.actor.layer > tMaskUntil) {
          // Tell the compositor to apply the
          // mask image created earlier
          // This will also delete the current mask
          // image from memory.
          tCompositor.endClipping();

          tMaskUntilStack.pop();
        } else {
          return;
        }
      }

      tParent.data.maskUntil = void 0;
    }
  }

  function getMaskRecords(pRenderData) {
    var tPaths;
    var tPath;
    var tMaskRecords = new Records();
    var i, il;

    if (!pRenderData || !pRenderData.paths || pRenderData.paths.length === 0) {
      return null;
    }

    tPaths = pRenderData.paths;
    
    tMaskRecords.program(pRenderData.records.commands[0].program);

    for(i = 0, il = tPaths.length; i < il; i++) {

      if (!tPath) {
        tPath = tPaths[i];
      } else {
        tPath.concat(tPaths[i]);
      }
    }

    tMaskRecords.path(tPath);
    tMaskRecords.fill();
    tMaskRecords.clearData();

    return tMaskRecords;
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var Rect = benri.geometry.Rect;
  var Matrix2D = benri.geometry.Matrix2D;

  /**
   * A class for Actors that exist on the Display List of the SWF file.
   * @class
   * @extends {theatre.Actor}
   */
  var DisplayListActor = (function(pSuper) {

    var onPreRender = theatre.crews.swf.render.renderPropOnPreRender;
    var onPostRender = theatre.crews.swf.render.renderPropOnPostRender;
    var onFinalizeRender = theatre.crews.swf.render.renderPropOnFinalizeRender;

    function DisplayListActor(pArgs) {
      pSuper.call(this);

      this.displayListId = pArgs.displayListId;

      /**
       * The player this Actor is playing in.
       * It is unknown at constructor time
       * and will be set in the enter event.
       * @type {theatre.crews.swf.Player}
       */
      this.player = null;

      /**
       * Variables that are set and get in ActionScript.
       * @type {object}
       */
      this.data.variables = {};

      /**
       * The colour transform to apply to this Actor
       * while rendering (if any).
       * @type {quickswf.structs.CXFORM=}
       */
      this.colorTransform = null;

      /**
       * If non-zero, this Actor should start a new mask
       * with a depth of this number.
       * @type {number}
       */
      this.clipDepth = 0;

      /**
       * The ratio of the Actor for use in MorphShape.
       * @type {number}
       */
      this.ratio = 0;

      this.data.renderable = pArgs.renderable || null;

      /**
       * The name of the Actor as written in the SWF file.
       * We are lower casing the regular TheatreScript name.
       * @type {string}
       */
      this.data.swfName = pArgs.swfName;

      // When we enter the Stage, all DisplayList Actors invalidate themselves for rendering.
      this.on('prepare', onPrepare, 1);

      this.on('readd', onReadd);

      this.on('enter', onEnter, 1);

      // Privates

      /**
       * Function for handling hit tests.
       * If null, it means we are not doing hit tests.
       * @private
       * @type {function}
       */
      this._onHitTest = null;
    }

    function onPrepare(pData, pTarget) {
      var tPlayer = pTarget.player;

      // Set the names on first enter.
      if (tPlayer === null) {
        tPlayer = pTarget.player = pTarget.parent.player;
      }

      if (pTarget.name === '') {
        pTarget.name = pTarget.data.swfName = pTarget.getScene() !== null ?
          'instance' + (++tPlayer.spriteInstanceCounter) :
          '__swfcrew_object__' + (++tPlayer.notSpriteInstanceCounter);
      }

      /*this.enableHitTest();
      this.on('pointerdown', function(pData){console.log("DOWN", pData.target.displayListId, pData.target.getName(), pData.x, pData.y, pData)});
      this.on('pointermove', function(pData){console.log("MOVE", pData.target.displayListId, pData.target.getName(), pData.x, pData.y)});
      this.on('pointerup', function(pData){console.log("UP", pData.target.displayListId, pData.target.getName(), pData.x, pData.y)});*/
    }

    function onReadd(pData, pTarget) {
      pTarget.colorTransform = null;
    }

    function onEnter(pData, pTarget) {
      var tProp = pTarget.player.renderManagerProp.makeRenderable(pTarget);

      //tProp.on('postrender', onPostRender);

      pTarget.emit('renderprop', tProp);

      tProp.on('prerender', onPreRender);
      
      tProp.on('finalizerender', onFinalizeRender);
    }

    DisplayListActor.prototype = Object.create(pSuper.prototype);
    DisplayListActor.prototype.constructor = DisplayListActor;

    function onHitTest(pData, pTarget) {
      var tPlayer = pTarget.player;
      var tBounds = pTarget.props.bounds.getAbsoluteBounds();

      if (tBounds) {
        tBounds = tBounds.clone().transform(tPlayer.compositor.applyTransform(Matrix2D.obtainAndAutoRelease()));

        var tPixelRatio = tPlayer.compositor.pixelRatio;
        var tScaleFactor = tPlayer.compositor.scaleFactor;
        
        if (tBounds.isPointInside(
          pData.x * tPixelRatio * tScaleFactor,
          pData.y * tPixelRatio * tScaleFactor
        )) {
          pData.capture(pTarget);
        }
      }
    }

    DisplayListActor.prototype.enableHitTest = function() {
      if (this._onHitTest !== null) {
        return;
      }

      this._onHitTest = onHitTest;

      this.on('hittest', onHitTest);
    };

    DisplayListActor.prototype.disableHitTest = function() {
      if (this._onHitTest === null) {
        return;
      }

      this._onHitTest = null;

      this.ignore('hittest', this._onHitTest);
    };

    /**
     * Registers callback function to be invoked when the variable changes.
     * @param {string} pVariableName The name of variable.
     * @param {function} pListener The callback function to be invoked when the variable changes.
     */
    DisplayListActor.prototype.addVariableListener = function(pVariableName, pListener) {
      var tVarName = pVariableName.toLowerCase();
      var tVarData = this.data.variables[tVarName];

      if (tVarData) {
        var tListeners = tVarData.listeners;
        
        if (tListeners) {
          tListeners.push(pListener);
        } else {
          tVarData.listeners = [pListener];
        }
      } else {
        tVarData = {
          name: pVariableName,
          listeners: [pListener]
        };
        this.data.variables[tVarName] = tVarData;
      }
    };

    /**
     * Unregisters callback function to be invoked when the variable changes.
     * @param {string} pVariableName The name of variable.
     * @param {function} pListener The callback function to be removed.
     */
    DisplayListActor.prototype.removeVariableListener = function(pVariableName, pListener) {
      var tVarData = this.data.variables[pVariableName.toLowerCase()];

      if (tVarData) {
        var tListeners = tVarData.listeners;

        if (tListeners) {
          var tIndex = tListeners.indexOf(pListener);

          if (tIndex !== -1) {
            tListeners.splice(tIndex, 1);
          }
        }
      }
    };

    /**
     * Get's a variable saved in this Actor.
     * @param  {string} pName The name of the variable.
     */
    DisplayListActor.prototype.getVariable = function(pName) {
      var tData = this.data.variables[pName.toLowerCase()];
      return tData ? tData.value : void 0;
    };

    /**
     * Set's a variable to be saved in this Actor.
     * @param {string} pName  The name of the variable.
     * @param {object} pValue The value of the variable.
     */
    DisplayListActor.prototype.setVariable = function(pName, pValue) {
      var tName = pName.toLowerCase();
      var tData = this.data.variables[tName];

      if (tData) {
        if (tData.value !== pValue) {
          tData.value = pValue;
          // Notify the listeners.
          var tListeners = tData.listeners;
          if (tListeners) {
            for (var i = 0, il = tListeners.length; i < il; i++) {
              tListeners[i](pValue);
            }
          }
        }
      } else {
        tData = {
            name: pName,
            value: pValue
          };
        this.data.variables[tName] = tData;
      }
    };

    return DisplayListActor;
  })(theatre.Actor);

  theatre.crews.swf.actors.DisplayListActor = DisplayListActor;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;

  /**
   * @class
   * @extends {theatre.crews.swf.actors.DisplayListActor}
   */
  var SpriteActor = (function(pSuper) {
    var ContainerBoundsProp = theatre.crews.bounds.ContainerBoundsProp;
    var ContainerCacheProp = theatre.crews.render.ContainerCacheProp;

    var onStartCache = theatre.crews.swf.render.renderPropOnStartCache;
    var onFinishCache = theatre.crews.swf.render.renderPropOnFinishCache;
    var onRenderCache = theatre.crews.swf.render.renderPropOnRenderCache;

    function SpriteActor(pArgs) {
      pSuper.call(this, pArgs);

      this.props.add(new ContainerBoundsProp());

      this.on('renderprop', onRenderProp);

      this.setScene(pArgs.scene);
    }

    SpriteActor.prototype = Object.create(pSuper.prototype);
    SpriteActor.prototype.constructor = SpriteActor;

    function onRenderProp(pProp, pTarget) {
      if (pTarget.player.spriteCache === false) {
        return;
      }

      pTarget.props.add(new ContainerCacheProp('did$' + pTarget.displayListId + '$' + pTarget.id, pTarget.player.cacheInvalidationRatio));
      
      pProp.on('startcache', onStartCache);
      pProp.on('finishcache', onFinishCache);
      pProp.on('rendercache', onRenderCache);
    }

    /**
     * Returns all the variables in this movie clip.
     * @return {Object} An object containing all variable names and values.
     */
    SpriteActor.prototype.getAllVariables = function () {
      var tVariables = this.data.variables,
          tKeyValueList = {}, tData;

      for (var k in tVariables) {
        tData = tVariables[k];
        if (tData) {
          tKeyValueList[tData.name] = tData.value;
        }
      }

      return tKeyValueList;
    };

    return SpriteActor;
  })(mSWFCrew.actors.DisplayListActor);

  mSWFCrew.actors.SpriteActor = SpriteActor;

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;
  var Rect = global.benri.geometry.Rect;
  var Stage = theatre.Stage;
  var Matrix2D = benri.geometry.Matrix2D;
  var ColorTransform = mSWFCrew.structs.ColorTransform;

  function translateKeyCode(pKeyCode, pShift) {
    var tKeyCode = pKeyCode;
    switch (pKeyCode) {
    case 9: // tab
      tKeyCode = 18;
      break;
    case 27: // escape
      tKeyCode = 19;
      break;
    case 37: // left
      tKeyCode =  1;
      break;
    case 38: // up
      tKeyCode = 14;
      break;
    case 39: // right
      tKeyCode = 2;
      break;
    case 40: // down
      tKeyCode = 15;
      break;
    case 46: // delete
      tKeyCode = 6;
      break;
    case 51: // 3
      if (pShift) {
        // Convert '3' into '#'.
        tKeyCode = 35;
      }
      break;
    }
    return tKeyCode;
  };

  /**
   * @class
   * @extends {theatre.crews.swf.actors.DisplayListActor}
   */
  var ButtonActor = (function(pSuper) {
    var ButtonBoundsProp = theatre.crews.swf.props.ButtonBoundsProp;
    var ContainerBoundsProp = theatre.crews.bounds.ContainerBoundsProp;

    function ButtonActor(pArgs) {
      pSuper.call(this, pArgs);

      this.buttonState = 'up';
      this.hitTestActor = null;
      this.isMenu = pArgs.isMenu;

      if (pArgs.hitRect === true) {
        this.props.add(new ButtonBoundsProp());
      } else {
        this.props.add(new ContainerBoundsProp());
      }

      var tCondActions = pArgs.condActions;
      var tRecords = pArgs.records;
      var tThis = this, tParent;

      // Updates button records.
      function doUpdateButtonRecords() {
        var tChildren = tThis.getActors();
        var i, il;

        // Remove button records.
        for (i = 0, il = tChildren.length; i < il; i++) {
          tChildren[i].leave();
        }

        // Add button records.
        for (i = 0, il = tRecords.length; i < il; i++) {
          var tRecord = tRecords[i], tActor,
              tButtonState = tThis.buttonState;

          if (
            tButtonState === 'up' && tRecord.state.up
            || tButtonState === 'down' && tRecord.state.down
            || tRecord.state.hitTest
            ) {

            tActor = tThis.player.newFromId(tRecord.id);

            if (tRecord.matrix) {
              tActor.position.set(tRecord.matrix);
            }

            tActor.colorTransform = ColorTransform.fromQuickSWF(tRecord.colorTransform);
            tThis.addActorAtLayer(tActor, tRecord.depth);

            if (tRecord.state.hitTest) {
              tThis.hitTestActor = tActor;

              if (
                tButtonState === 'up' && tRecord.state.up ||
                tButtonState === 'down' && tRecord.state.down
                ) {
                ;
              } else {
                if (tActor.props.render) {
                  tActor.props.render.isVisible = false;
                }
              }
            }
          }
        }
      }

      // Register the event handlers.

      function onKeyDown(pEvent, pTarget) {
        var tKeyCode = translateKeyCode(pEvent.code, pEvent.shift);
        var i, il, tCond, tScript;

        pTarget.state = Stage.STATE_SCRIPTING;

        for (i = 0, il = tCondActions.length; i < il; i++) {
          tCond = tCondActions[i].cond;
          tScript = tCondActions[i].script;

          if (tCond.keyPress === tKeyCode) {
            tScript(tParent);
          }
        }

        pTarget.doScheduledScripts();
        pTarget.state = Stage.STATE_IDLING;
      }

      function onPointerDown(pEvent, pTarget) {
        if (pTarget.buttonState === 'down') {
          return;
        }

        var i, il, tCond, tScript;
        var tStage = pTarget.stage;

        if (tStage === null) {
          return;
        }

        pTarget.buttonState = 'down';
        tStage.state = Stage.STATE_SCRIPTING;

        for (i = 0, il = tCondActions.length; i < il; i++) {
          tCond = tCondActions[i].cond;
          tScript = tCondActions[i].script;

          if (tCond.overUpToOverDown) {
            tScript(tParent);
          }
        }

        tParent = pTarget.parent; // To prevent memory leak.

        if (pTarget.stage !== null) {
          doUpdateButtonRecords();          
        }

        tStage.doScheduledScripts();

        tStage.state = Stage.STATE_IDLING;
      }

      function onPointerUp(pEvent, pTarget) {
        if (pTarget.buttonState === 'up') {
          return;
        }

        var i, il, tCond, tScript;
        var tStage = pTarget.stage;

        if (tStage === null) {
          return;
        }

        pTarget.buttonState = 'up';
        tStage.state = Stage.STATE_SCRIPTING;

        for (i = 0, il = tCondActions.length; i < il; i++) {
          tCond = tCondActions[i].cond;
          tScript = tCondActions[i].script;

          if (tCond.overDownToOverUp) {
            tScript(tParent);
          }
        }
        
        tParent = pTarget.parent; // To prevent memory leak.

        doUpdateButtonRecords();

        tStage.doScheduledScripts();

        tStage.state = Stage.STATE_IDLING;
      }

      this.on('enter', function(pData, pTarget) {
        tParent = pTarget.parent;
        doUpdateButtonRecords();
        pTarget.stage.on('keydown', onKeyDown);
        pTarget.enableHitTest();
        pTarget.on('pointerdown', onPointerDown);
        pTarget.on('pointerup', onPointerUp);
      });

      this.on('leave', function(pData, pTarget) {
        pTarget.stage.ignore('keydown', onKeyDown);
        pTarget.disableHitTest();
        pTarget.ignore('pointerdown', onPointerDown);
        pTarget.ignore('pointerup', onPointerUp);
        pTarget.buttonState = 'up';
      });
    }

    ButtonActor.prototype = Object.create(pSuper.prototype);
    ButtonActor.prototype.constructor = ButtonActor;

    return ButtonActor;
  })(mSWFCrew.actors.DisplayListActor);

  mSWFCrew.actors.ButtonActor = ButtonActor;

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;
  var mHandlers = mSWFCrew.handlers;
  var ButtonActor = mSWFCrew.actors.ButtonActor;
  var Matrix2D = benri.geometry.Matrix2D;
  var Rect = benri.geometry.Rect;

  function createLoaderWrapper(pActionScriptLoader, pActionScriptProgram, pScripts, pSWFVersion) {
    var tId = pActionScriptLoader.load(
      pActionScriptProgram,
      pScripts,
      {
        version: pSWFVersion
      }
    );

    return function(pTarget) {
      pActionScriptProgram.run(tId, pTarget, pTarget.player.root);
    }
  }

  /**
   * Handles SWF Buttons.
   * @param {quickswf.Sprite} pSprite The Sprite to handle.
   */
  mHandlers['DefineButton'] = function(pButton) {
    var tCondActions = [];
    var tRecords = [];
    var i, il;
    var tRawCondActions = pButton.condActions || [],
        tRawRecords = pButton.records || [];

    // Set button actions.
    var tKeyEnterPress = null;
    var tMouseClick = null;
    var tHitRect = false;

    var tActorMap = this.actorMap;

    for (i = 0, il = tRawCondActions.length; i < il; i++) {
      var tRawCondAction = tRawCondActions[i];
      var tCond = tRawCondAction.cond;
      var tCondAction = {
        cond: tCond,
        script: createLoaderWrapper(this.actionScriptLoader, this.actionScriptProgram, tRawCondAction.action, this.swf.version)
      };

      if (tCond.keyPress === 13) {
        tKeyEnterPress = tCondAction;
      }

      if (tCond.overUpToOverDown) {
        tMouseClick = tCondAction;
      }

      if (tCond.overDownToOverUp) {
        tMouseClick = tCondAction;
      }

      tCondActions.push(tCondAction);
    }

    // For mobile, treat a mouse click as an enter key.
    if (tMouseClick === null && tKeyEnterPress !== null) {
      tKeyEnterPress.cond.overDownToOverUp = 1;
    }

    // Map the button shapes' Actor class.
    for (i = 0, il = tRawRecords.length; i < il; i++) {
      var tRawRecord = tRawRecords[i],
          tRecord = {};

      if (tRawRecord.state.hitTest) {
        tHitRect = true;
      }

      for (var k in tRawRecord) {
        tRecord[k] = tRawRecord[k];
      }

      tRecords.push(tRecord);
    }

    this.register(pButton.id, ButtonActor, {
      condActions: tCondActions,
      records: tRecords,
      isMenu: pButton.isMenu,
      hitRect: tHitRect
    });
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mActors = theatre.crews.swf.actors;

  /**
   * @class
   * @extends {theatre.crews.swf.actors.DisplayListActor}
   */
  var TextActor = (function(pSuper) {
    var BoundsProp = theatre.crews.bounds.BoundsProp;
    var onRenderable = theatre.crews.swf.render.renderPropOnRenderable;
    
    function TextActor(pArgs) {
      pSuper.call(this, pArgs);

      this.props.add(
        new BoundsProp(pArgs.originX, pArgs.originY, pArgs.width, pArgs.height)
      );

      this.on('renderprop', onRenderProp);
    }

    function onRenderProp(pProp, pTarget) {
      pProp.on('renderable', onRenderable);
    }

    TextActor.prototype = Object.create(pSuper.prototype);
    TextActor.prototype.constructor = TextActor;

    return TextActor;
  })(mActors.DisplayListActor);

  mActors.TextActor = TextActor;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mActors = theatre.crews.swf.actors;

  /**
   * @class
   * @extends {theatre.crews.swf.actors.DisplayListActor}
   */
  var ShapeActor = (function(pSuper) {
    var BoundsProp = theatre.crews.bounds.BoundsProp;
    var ShapeCacheProp = theatre.crews.swf.props.ShapeCacheProp;
    var onRenderable = theatre.crews.swf.render.renderPropOnRenderable;

    var onStartCache = theatre.crews.swf.render.renderPropOnStartCache;
    var onFinishCache = theatre.crews.swf.render.renderPropOnFinishCache;
    var onRenderCache = theatre.crews.swf.render.renderPropOnRenderCache;

    function ShapeActor(pArgs) {
      pSuper.call(this, pArgs);

      this.props.add(
        new BoundsProp(pArgs.originX, pArgs.originY, pArgs.width, pArgs.height)
      );

      this.on('renderprop', onRenderProp);
    }

    function onRenderProp(pProp, pTarget) {
      pProp.on('renderable', onRenderable);

      var tRenderData = pTarget.data.renderable.renderData;

      if (
          tRenderData.disableCache === true ||
          tRenderData.numOfBitmaps > 1 ||
          (tRenderData.numOfVerticies < pTarget.player.complexShapeNumOfVerticies &&
          tRenderData.numOfBitmaps !== 1) ||
          tRenderData.outOfBounds === true
        ) {
        return;
      }

      pTarget.props.add(
        new ShapeCacheProp('did$' + pTarget.displayListId, tRenderData, pTarget.player.cacheInvalidationRatio)
      );

      pProp.on('startcache', onStartCache);
      pProp.on('finishcache', onFinishCache);
      pProp.on('rendercache', onRenderCache);
    }

    ShapeActor.prototype = Object.create(pSuper.prototype);
    ShapeActor.prototype.constructor = ShapeActor;

    return ShapeActor;
  })(mActors.DisplayListActor);

  mActors.ShapeActor = ShapeActor;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mActors = theatre.crews.swf.actors;
  var Rect = global.benri.geometry.Rect;

  /**
   * @class
   * @extends {theatre.crews.swf.actors.ShapeActor}
   */
  var MorphShapeActor = (function(pSuper) {
    var onPreRender = theatre.crews.swf.render.renderPropOnMorphShapePreRender;
    var MorphShapeBoundsProp = theatre.crews.swf.props.MorphShapeBoundsProp;

    function MorphShapeActor(pArgs) {
      pSuper.call(this, pArgs);

      this.startBounds = pArgs.startBounds;
      this.endBounds = pArgs.endBounds;

      this.props.add(
        new MorphShapeBoundsProp(pArgs.startBounds, pArgs.endBounds)
      );

      // TODO: Add cache prop?

      this.on('renderprop', onRenderProp);
    }

    MorphShapeActor.prototype = Object.create(pSuper.prototype);
    MorphShapeActor.prototype.constructor = MorphShapeActor;

    function onRenderProp(pProp, pTarget) {
      pTarget.lastRatio = -1;
      pProp.on('prerender', onPreRender);
    }
    
    return MorphShapeActor;
  })(mActors.ShapeActor);

  mActors.MorphShapeActor = MorphShapeActor;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.event.StoppableEventEmitter = StoppableEventEmitter;

  var EventEmitter = benri.event.EventEmitter;
  var on = EventEmitter.on;
  var ignore = EventEmitter.ignore;

  function StoppableEventEmitter(pInstance) {
    pInstance = pInstance || this;

    pInstance._events = {};

    pInstance.on = on;
    pInstance.ignore = ignore;
    pInstance.emit = emit;
  }

  function emit(pName, pData) {
    var tNode = this._events[pName];
    var tCallback;
    var tStop = false;

    function stop() {
      tStop = true;
    }

    if (tNode === void 0) {
      return true;
    }

    pData.stop = stop;

    do {
      tCallback = tNode.data;
      tCallback(pData, this);

      tNode = tNode.next;
    } while (tStop === false && tNode !== null);

    return !tStop;
  }

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var RenderProp = (function(pSuper) {
    var StoppableEventEmitter = benri.event.StoppableEventEmitter;

    /**
     * @constructor
     */
    function RenderProp(pRenderManagerProp, pBaseHash) {
      pSuper.call(this);

      StoppableEventEmitter(this);

      this.type = 'render';

      this.renderManagerProp = pRenderManagerProp;

      this.isVisible = true;

      this._currentCallback = null;
    }

    var tProto = RenderProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = RenderProp;

    function createOnActorEnter(pRenderProp) {
      return function onActorEnter(pData, pTarget) {
        pRenderProp.renderManagerProp.register(pRenderProp);
        pTarget.onFor('leave', (pRenderProp._currentCallback = createOnActorLeave(pRenderProp)), 1);
      };
    }

    function createOnActorLeave(pRenderProp) {
      return function onActorLeave(pData, pTarget) {
        pRenderProp.renderManagerProp.unregister(pRenderProp);
        pTarget.onFor('enter', (pRenderProp._currentCallback = createOnActorEnter(pRenderProp)), 1);
      };
    }

    function onActorEnter(pData, pTarget) {
      pTarget.onFor('leave', onActorLeave, 1);
    }

    var superOnAdd = pSuper.prototype.onAdd;

    tProto.onAdd = function onAdd(pActor) {
      superOnAdd.call(this, pActor);

      if (pActor.stageId === -1) {
        pActor.onFor('enter', (this._currentCallback = createOnActorEnter(this)), 1);
      } else {
        this.renderManagerProp.register(this);
        pActor.onFor('leave', (this._currentCallback = createOnActorLeave(this)), 1);
      }
    };

    var superOnRemove = pSuper.prototype.onRemove;

    tProto.onRemove = function onRemove() {
      if (this.actor.stageId !== -1) {
        this.renderManagerProp.unregister(this);
        this.actor.ignore('leave', this._currentCallback);
      } else {
        this.actor.ignore('enter', this._currentCallback);
      }

      this._currentCallback = null;

      superOnRemove.call(this);
    };

    tProto.getRenderable = function getRenderable() {
      var tPackage = {
        renderable: null
      };

      this.emit('renderable', tPackage);

      return tPackage.renderable;
    };

    tProto.preRender = function preRender(pPackage) {
      return this.emit('prerender', pPackage);
    };

    tProto.postRender = function postRender(pPackage) {
      this.emit('postrender', pPackage);
    };

    tProto.finalizeRender = function finalizeRender(pPackage) {
      this.emit('finalizerender', pPackage);
    };

    return RenderProp;
  })(theatre.Prop);

  theatre.crews.render.RenderProp = RenderProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 TheatreScript Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  theatre.crews.render.RenderManagerProp = RenderManagerProp;

  var requestAnimationFrame;

  if (global.requestAnimationFrame !== void 0) {
    requestAnimationFrame = global.requestAnimationFrame;
  } else if (global.webkitRequestAnimationFrame !== void 0) {
    requestAnimationFrame = global.webkitRequestAnimationFrame;
  } else if (global.mozRequestAnimationFrame !== void 0) {
    requestAnimationFrame = global.mozRequestAnimationFrame;
  } else {
    requestAnimationFrame = function(pCallback) {
      return setTimeout(pCallback, 20);
    };
  }

  /**
   * @class
   * @extends {theatre.Prop}
   */
  var RenderManagerProp = (function(pSuper) {
    var RenderProp = theatre.crews.render.RenderProp;
    var CacheManager = theatre.crews.render.CacheManager;
    var EventEmitter = benri.event.EventEmitter;

    /**
     * @constructor
     */
    function RenderManagerProp(pCamera) {
      pSuper.call(this);

      this.type = 'renderManager';

      EventEmitter(this);

      this.camera = pCamera;
      this.cacheManager = new CacheManager(pCamera);
      this.onRevalidated = null;

      this._animationFrameId = -1;
      this._props = new Array(256);

      this.syncRendering = false;

      this.makeRenderable = makeRenderable;
      this.register = register;
      this.unregister = unregister;
    }
  
    var tProto = RenderManagerProp.prototype = Object.create(pSuper.prototype);
    tProto.constructor = RenderManagerProp;
  
    tProto.onEnter = function(pStage) {
      pSuper.prototype.onEnter.call(this, pStage);

      var tStageManager = pStage.stageManager;
      var onRevalidated = this.onRevalidated = createOnRevalidated(this, this.syncRendering);

      pStage.on('revalidated', onRevalidated);        
    };

    tProto.onLeave = function() {
      this.stage.ignore('revalidated', this.onRevalidated);
    };

    function makeRenderable(pActor) {
      var tProp = new RenderProp(this);
      pActor.props.add(tProp);

      return tProp;
    }

    function register(pProp) {
      this._props[pProp.actor.stageId] = pProp;
    }

    function unregister(pProp) {
      this._props[pProp.actor.stageId] = void 0;
    }

    return RenderManagerProp;
  })(theatre.Prop);


  function createOnRevalidated(pRenderManagerProp, pSyncRendering) {
    return function onRevalidated(pData, pTarget) {
      var tInExecute = pTarget.inExecute;

      if (pSyncRendering === false) {
        if (pRenderManagerProp._animationFrameId === -1) {
          pRenderManagerProp._animationFrameId = requestAnimationFrame((function() {

            return function() {
              onAnimationFrame(pRenderManagerProp, tInExecute);
            };
          }()));
        }
      } else {
          onAnimationFrame(pRenderManagerProp, tInExecute);
      }

      /*if (pTarget.stage.inExecute === true) {
        pTarget.stage.onFor('leavestep', function() {
          onAnimationFrame(pRenderManagerProp, true);
        }, 1);
      } else {
        onAnimationFrame(pRenderManagerProp, false);
      }*/
    };
  }

  function onAnimationFrame(pRenderManagerProp, pDoCache) {
    pRenderManagerProp._animationFrameId = -1;

    var tProps = pRenderManagerProp._props;
    var tCamera = pRenderManagerProp.camera;
    var tContext = tCamera.context;
    var tPackage = {
      context: tContext
    };

    tContext.matrix.reset();
    tContext.backgroundColor = tCamera.backgroundColor;
    tContext.clear();

    pRenderManagerProp.emit('render', tPackage);

    var tActor = pRenderManagerProp.stage.stageManager;
    var tProp;
    var tRenderable;
    var tNode = tActor.node;

    var tCurrentNode = tActor.node;
    var tNextNode;
    var tLeaveNodeStack = new Array();
    var tCanContinue = true;
    var tHasChild;

    var tCacheProp;
    var tCache;
    var tCacheManager = pRenderManagerProp.cacheManager;

    main: while (true) {
      tActor = tCurrentNode.actor;
      tProp = tProps[tActor.stageId];
      tNextNode = tCurrentNode.next;
      tHasChild = tCurrentNode.hasChild;

      if (tProp === void 0) {
        if (!tHasChild) {
          do {
            tCurrentNode = tLeaveNodeStack.pop();
            tActor = tCurrentNode.actor;
            tProp = tProps[tActor.stageId];

            if (tProp !== void 0) {
              tCacheProp = tActor.props.renderCache;

              if (tCacheProp !== void 0) {
                tCache = tCacheManager.finishCache(tCacheProp);

                if (tCache !== null) {
                  tProp.emit('finishcache', tPackage);
                  tProp.emit('rendercache', tPackage);

                  tContext.matrix.recycle();
                  tContext.matrix = tCamera.getMatrix(tActor.getAbsolutePosition());

                  tCache.render();
                }
              }

              tProp.finalizeRender(tPackage);
            }

            if (tLeaveNodeStack.length === 0) {
              break main;
            }
          } while(!tCurrentNode.nextSibling);
        } else {
          tLeaveNodeStack.push(tCurrentNode);
        }

        tCurrentNode = tNextNode;

        continue;
      }

      tCanContinue = (tProp.isVisible === true && tProp.preRender(tPackage) === true);

      if (tCanContinue === true) {
        tCacheProp = tActor.props.renderCache;

        if (tCacheProp !== void 0) {
          tCache = tCacheManager.getCache(tCacheProp.hash);

          if (tCache !== void 0) {
            if (tCacheProp.isInvalid(pRenderManagerProp, tCache) === true) {
              tCache.destroy();
              tCache = void 0;
            } else {
              // No need to process the children anymore.
              tCanContinue = false;

              tProp.emit('rendercache', tPackage);

              tContext.matrix.recycle();
              tContext.matrix = tCamera.getMatrix(tActor.getAbsolutePosition());

              tCache.render();

              tProp.finalizeRender(tPackage);

              tNextNode = tCurrentNode.nextSibling;

              if (!tNextNode) {
                tNextNode = tCurrentNode.getTailNode().next;
              } else {
                tCurrentNode = tNextNode;

                continue;
              }
            }
          } else if (pDoCache === true && tCacheProp.isCachable(pRenderManagerProp) === true) {
            if (tCacheManager.startCache(tCacheProp) === true) {
              tProp.emit('startcache', tPackage);
            }
          }
        } else {
          tCache = void 0;
        }

        if (tCache === void 0) {
          tRenderable = tProp.getRenderable();

          if (tRenderable !== null) {
            tContext.matrix.recycle();
            tContext.matrix = tCamera.getMatrix(tActor.getAbsolutePosition());

            tRenderable.render(tContext);
          }

          tLeaveNodeStack.push(tCurrentNode);
        }
      } else {
        tProp.finalizeRender(tPackage);

        tNextNode = tCurrentNode.nextSibling;

        if (!tNextNode) {
          tNextNode = tCurrentNode.getTailNode().next;
        } else {
          tCurrentNode = tNextNode;

          continue;
        }
      }

      if (tHasChild === false || tCanContinue === false) {
        do {
          tCurrentNode = tLeaveNodeStack.pop();
          tActor = tCurrentNode.actor;
          tProp = tProps[tActor.stageId];

          if (tProp !== void 0) {
            tCacheProp = tActor.props.renderCache;

            if (tCacheProp !== void 0) {
              tCache = tCacheManager.finishCache(tCacheProp);

              if (tCache !== null) {
                tProp.emit('finishcache', tPackage);
                tProp.emit('rendercache', tPackage);

                tContext.matrix.recycle();
                tContext.matrix = tCamera.getMatrix(tActor.getAbsolutePosition());

                tCache.render();
              }
            }

            tProp.finalizeRender(tPackage);
          }

          if (tLeaveNodeStack.length === 0) {
            break main;
          }
        } while(!tCurrentNode.nextSibling);
      }

      tCurrentNode = tNextNode;
    }

    pRenderManagerProp.emit('finalizerender', tPackage);

    tCacheManager.cleanup();

    tContext.flush();
  }

  theatre.crews.render.RenderManagerProp = RenderManagerProp;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var EventEmitter = benri.event.EventEmitter;

  /**
   * @class
   * A class that stores past cues.
   * When using on() with this class, if the given
   * event name has already had a cue fired,
   * the handler will be executed right away with
   * the old data.
   * @constructor
   */
  function PersistentEventEmitter(pInstance) {
    pInstance = pInstance || this;

    EventEmitter(pInstance);

    pInstance._eventResults = {};

    pInstance._baseOn = pInstance.on;
    pInstance._baseEmit = pInstance.emit;
    pInstance._emittingEventStack = [];

    pInstance.on = on;
    pInstance.emit = emit;
    pInstance.emitOnce = emitOnce;
    pInstance.resetEvent = resetEvent;
  }

  function on(pName, pCallback, pCount) {
    this._baseOn(pName, pCallback, pCount);

    var tEventResults = this._eventResults;

    if (pName in tEventResults && this._emittingEventStack.indexOf(pName) === -1) {
      pCallback(tEventResults[pName], this);
    }
  }

  function emit(pName, pData) {
    this._eventResults[pName] = pData;

    this._emittingEventStack.push(pName);
    this._baseEmit(pName, pData);
    this._emittingEventStack.pop();
  }

  function emitOnce(pName, pData) {
    this._baseEmit(pName, pData);
  }

  function resetEvent(pName) {
    if (!pName) {
      this._eventResults = {};
    } else {
      delete this._eventResults[pName];
    }
  }

  benri.event.PersistentEventEmitter = PersistentEventEmitter;

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {
  var swfcrew = theatre.crews.swf;
  var PersistentEventEmitter = benri.event.PersistentEventEmitter;
  
  /**
   * @constructor
   */
  function Loader() {
    PersistentEventEmitter(this);
    this.swf = null;
    this.options = {};
    this.actionScriptLoader = null;
    this.actionScriptProgram = null;
    this.actorMap = [];
    this.actorNameMap = {};
    this.fontCache = [];
    this.media = null;
    this.url = null;
  }

  swfcrew.Loader = Loader;

  Loader.prototype.register = function(pId, pClass, pArgs) {
    pArgs.displayListId = pId;
    
    this.actorMap[pId] = {
      clazz: pClass,
      args: pArgs
    }
  };

  Loader.prototype.load = function(pSWF, pOptions) {
    this.options = pOptions = (pOptions || {});
    this.swf = pSWF;

    if ('antialias' in pOptions) {
      benri.env.setVar('benri.graphics.surface.antialias', pOptions.antialias);
    }

    this.emit('loadstart', pSWF);

    var tASType = pOptions.asType || 'AS1VM';

    var tActionScriptProgram = this.actionScriptProgram = AlphabetJS.createProgram(tASType, swfcrew.ASHandlers);
    var tActionScriptLoader = this.actionScriptLoader = AlphabetJS.createLoader(tASType);
    var tActorTypes = swfcrew.actors;

    this.media = pSWF.assetManifest;

    var tDictionaryToActorMap = this.actorMap;
    var i, il;
    var tHandlers = swfcrew.handlers;
    var tDictionary = pSWF.orderedDictionary;
    var tId;
    var tObject;
    var tDisplayListType;
    var tParams, tOptions;

    for (i = 0, il = tDictionary.length; i < il; i++) {
      tObject = tDictionary[i];
      tId = tObject.id;
      tDisplayListType = tObject.displayListType;

      if (tHandlers[tDisplayListType] === void 0) {
        continue;
      }

      tHandlers[tDisplayListType].call(this, tObject);
    }

    tHandlers['DefineSprite'].call(this, pSWF.rootSprite);

    // URL params
    if (this.url) {
      this.url.query.setEncoding(pSWF.encoding);
      tParams = this.url.query.toJSON();
      tOptions = this.options.rootVars;
      if (!tOptions) {
        tOptions = this.options.rootVars = {};
      }
      for (var k in tParams) {
        tOptions[k] = tParams[k];
      }
    }

    this.emit('loadcomplete', pSWF);
  };

  Loader.prototype.setFontCache = function(pId, pFont) {
    this.fontCache[pId] = pFont;
  };

  Loader.prototype.getFontCache = function(pId) {
    return this.fontCache[pId] || null;
  };

  Loader.prototype.clearFontCache = function() {
    this.fontCache.length = 0;
  };


  /**
   * @class
   * @extends Loader
   */
  var DataLoader = (function(pSuper) {
    function DataLoader() {
      pSuper.call(this);
    }

    DataLoader.prototype = Object.create(pSuper.prototype);
    DataLoader.prototype.constructor = DataLoader;

    DataLoader.prototype.load = function(pData, pOptions) {
      this.options = pOptions = (pOptions || {});

      var tSelf = this;
      var tDelay = quickswf.SWF.fromBuffer(pData, 'application/x-shockwave-flash');

      this.emit('parsestart', {delay: tDelay, buffer: pData});

      tDelay.then(
        function(pSWF) {
          tSelf.swf = pSWF;
          tSelf.emit('parsecomplete', pSWF);
          pSuper.prototype.load.call(tSelf, pSWF, pOptions);
        },
        function(pError) {
          tSelf.emit('error', pError);
        }
      );
    };

    return DataLoader;
  })(Loader);

  swfcrew.DataLoader = DataLoader;

  /**
   * @class
   * @extends DataLoader
   */
  var URLLoader = (function(pSuper) {
    function URLLoader() {
      pSuper.call(this);
    }

    URLLoader.prototype = Object.create(pSuper.prototype);
    URLLoader.prototype.constructor = URLLoader;

    URLLoader.prototype.load = function(pURL, pOptions) {
      this.options = pOptions = (pOptions || {});

      var tSelf = this;
      var tRequest = new benri.net.Request(pURL, 'GET', true);

      tRequest.send(null)
      .then(function(pResponse) {
        tSelf.url = tRequest.url;
        tSelf.emit('downloadcomplete', pResponse);
        pSuper.prototype.load.call(tSelf, pResponse.body, pOptions);
      })
      .as(function(e) {
        tSelf.emit('downloadprogress', e);
        // TODO: Progressive Loading
      })
      .catch(function(e) {
        tSelf.emit('error', e);
      });

      this.emit('downloadstart', tRequest);
    };

    return URLLoader;
  })(DataLoader);

  swfcrew.URLLoader = URLLoader;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var env = benri.env = {};

  benri.event.EventEmitter(env);

  var mVars = [];

  env.setVar = function(pName, pValue) {
    mVars[pName] = pValue + '';

    env.emit('setvar', {
      varName: pName,
      varValue: pValue
    });
  };

  env.getVar = function(pName) {
    return mVars[pName] || null;
  };

}());

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var log = benri.util.log;

  log.Logger = Logger;

  var mActiveLoggers = [];

  function Logger(pTag, pAdapters, pLevel) {
    this.tag = pTag;

    this.level = pLevel !== void 0 ? pLevel : log.LEVEL_INFO;

    this._adapters = [];

    for (var i = 0, il = pAdapters.length; i < il; i++) {
      this.addAdapter(pAdapters[i]);
    }

    mActiveLoggers.push(this);

    Logger.emit('loggerCreated', this);
  }

  benri.event.EventEmitter(Logger);

  Logger.getActiveLoggers = function() {
    return mActiveLoggers.slice(0);
  };

  var tProto = Logger.prototype;

  tProto.destroy = function() {
    var i;

    for (i = this._adapters.length - 1; i >= 0; i--) {
      this.removeAdapter(this._adapters[i]);
    }

    i = mActiveLoggers.indexOf(this);

    if (i !== -1) {
      mActiveLoggers.splice(i, 1);

      Logger.emit('loggerDestroyed', this);
    }
  };

  tProto.addAdapter = function(pAdapter) {
    if (this._adapters.indexOf(pAdapter) !== -1) {
      return;
    }

    this._adapters.push(pAdapter);
  };

  tProto.removeAdapter = function(pAdapter) {
    var tAdapters = this._adapters;

    for (var i = 0, il = tAdapters.length; i < il; i++) {
      if (tAdapters[i] === pAdapter) {
        tAdapters.splice(i, 1);

        return;
      }
    }
  }

  tProto.log = function(pLevel, pMessage, pData) {
    if (pLevel > this.level) {
      return;
    }

    var tAdapters = this._adapters;
    var tAdapter;

    for (var i = 0, il = tAdapters.length; i < il; i++) {
      tAdapter = tAdapters[i];

      if (pLevel <= tAdapter.level) {
        tAdapter.log(pLevel, pMessage, pData);
      }
    }
  };

  tProto.panic = function(pMessage, pData) {
    this.log(log.LEVEL_PANIC, this.tag + ':' + ' ' + pMessage, pData);
  };

  tProto.alert = function(pMessage, pData) {
    this.log(log.LEVEL_ALERT, this.tag + ':' + ' ' + pMessage, pData);
  };

  tProto.crit = function(pMessage, pData) {
    this.log(log.LEVEL_CRIT, this.tag + ':' + ' ' + pMessage, pData);
  };

  tProto.error = function(pMessage, pData) {
    this.log(log.LEVEL_ERROR, this.tag + ':' + ' ' + pMessage, pData);
  };

  tProto.warn = function(pMessage, pData) {
    this.log(log.LEVEL_WARN, this.tag + ':' + ' ' + pMessage, pData);
  };

  tProto.notice = function(pMessage, pData) {
    this.log(log.LEVEL_NOTICE, this.tag + ':' + ' ' + pMessage, pData);
  };

  tProto.info = function(pMessage, pData) {
    this.log(log.LEVEL_INFO, this.tag + ':' + ' ' + pMessage, pData);
  };

  tProto.debug = function(pMessage, pData) {
    this.log(log.LEVEL_DEBUG, this.tag + ':' + ' ' + pMessage, pData);
  };

  var tBenriLogger = log.benriLogger = new Logger('BenriJS', [
    new log.ConsoleAdapter({
      level: log.LEVEL_DEBUG
    })
  ]);

  var tLogLevel = benri.env.getVar('logLevel');

  if (tLogLevel !== null) {
    tBenriLogger.level = tLogLevel;
  } else {
    tBenriLogger.level = log.LEVEL_INFO;
  }

  benri.env.on('setvar', function(pEvent) {
    if (pEvent.varName === 'logLevel') {
      tBenriLogger.level = pEvent.varValue;
    }
  });

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
var quickswf = {
  structs: {

  },
  tags: {

  },
  utils: {

  },
  logger: new benri.util.log.Logger(
    'QuickSWF',
    [new benri.util.log.ConsoleAdapter({
      level: benri.util.log.LEVEL_DEBUG
    })]
  )
};

/**
 * @author Yuta Imaya
 * @author Jason Parrott (Slight namespace modifications)
 *
 * Copyright (C) 2012 Yuta Imaya.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var CRC32 = quickswf.utils.CRC32 = {};

  /**
   * CRC32 ハッシュ値を取得
   * @param {!Uint8Array} data data byte array.
   * @param {number=} pos data position.
   * @param {number=} length data length.
   * @return {number} CRC32.
   */
  CRC32.calc = function(pBuffer, pos, length) {
    return CRC32.update(pBuffer, 0, pos, length);
  };

  /**
   * CRC32ハッシュ値を更新
   * @param {!Uint8Array} data data byte array.
   * @param {number} crc CRC32.
   * @param {number=} pos data position.
   * @param {number=} length data length.
   * @return {number} CRC32.
   */
  CRC32.update = function(pBuffer, crc, pos, length) {
    var tData = pBuffer.data;
    var table = CRC32.Table;
    var i = (typeof pos === 'number') ? pos : (pos = 0);
    var il = (typeof length === 'number') ? length : pBuffer.length;

    crc ^= 0xffffffff;

    // loop unrolling for performance
    for (i = il & 7; i--; ++pos) {
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos]) & 0xff];
    }
    for (i = il >> 3; i--; pos += 8) {
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos    ]) & 0xff];
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos + 1]) & 0xff];
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos + 2]) & 0xff];
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos + 3]) & 0xff];
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos + 4]) & 0xff];
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos + 5]) & 0xff];
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos + 6]) & 0xff];
      crc = (crc >>> 8) ^ table[(crc ^ tData[pos + 7]) & 0xff];
    }

    return (crc ^ 0xffffffff) >>> 0;
  };

  CRC32.Table = (function() {
    /** @type {!(Array.<number>|Uint32Array)} */
    var table = global.Uint32Array ? new Uint32Array(256) : new Array(256);
    /** @type {number} */
    var c;
    /** @type {number} */
    var i;
    /** @type {number} */
    var j;

    for (i = 0; i < 256; ++i) {
      c = i;
      for (j = 0; j < 8; ++j) {
        c = (c & 1) ? (0xedB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c >>> 0;
    }

    return table;
  }());

}(this));

/**
 * @author Yuta Imaya
 * @author Jason Parrott (Namespace modifications)
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

//-----------------------------------------------------------------------------
// Code copied from zlib.js at https://github.com/imaya/zlib.js
// with permission from author.
//-----------------------------------------------------------------------------


(function(global) {

  quickswf.utils.Adler32 = Adler32;

  /**
   * Adler32 ハッシュ値の作成
   * @param {benri.io.Buffer} array 算出に使用する byte array.
   * @return {number} Adler32 ハッシュ値.
   */
  function Adler32(pBuffer) {
    return Adler32.update(1, pBuffer);
  };

  /**
   * Adler32 ハッシュ値の更新
   * @param {number} adler 現在のハッシュ値.
   * @param {benri.io.Buffer} array 更新に使用する byte array.
   * @return {number} Adler32 ハッシュ値.
   */
  Adler32.update = function(adler, pBuffer) {
    /** @type {number} */
    var s1 = adler & 0xffff;
    /** @type {number} */
    var s2 = (adler >>> 16) & 0xffff;
    /** @type {number} array length */
    var len = pBuffer.size;
    /** @type {number} loop length (don't overflow) */
    var tlen;
    /** @type {number} array index */
    var i = 0;

    var tBufferData = pBuffer.data;

    while (len > 0) {
      tlen = len > Adler32.OptimizationParameter ?
        Adler32.OptimizationParameter : len;
      len -= tlen;

      do {
        s1 += tBufferData[i++];
        s2 += s1;
      } while (--tlen);

      s1 %= 65521;
      s2 %= 65521;
    }

    return ((s2 << 16) | s1) >>> 0;
  };

  /**
   * Adler32 最適化パラメータ
   * 現状では 1024 程度が最適.
   * @see http://jsperf.com/adler-32-simple-vs-optimized/3
   * @const
   * @type {number}
   */
  Adler32.OptimizationParameter = 1024;

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 QuickSWF Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  /**
   * @class
   * @extends {benri.io.Reader}
   */
  var SWFReader = (function(pSuper) {
    /**
     * @constructor
     */
    function SWFReader(pSource) {
      pSuper.call(this, pSource);

      this.encoding = 'utf-8';

      /**
       * The current bit buffer.
       * @type {number}
       * @private
       */
      this._bitBuffer = 0;

      /**
       * The current bit buffer length;
       * @type {number}
       * @private
       */
      this._bitBufferLength = 0;
    }

    var tSuperProto = pSuper.prototype;
    var tProto = SWFReader.prototype = Object.create(tSuperProto);
    tProto.constructor = SWFReader;

    /**
     * Align the current bits to the nearest large byte.
     */
    tProto.align = function() {
      if (this._bitBufferLength !== 0) {
        this._bitBuffer = 0;
        this._bitBufferLength = 0;
      }
    };

    /**
     * Peeks a bits, not modifying the state of this Reader.
     * @param {number} pNumber The number of bits to peek at.
     * @return {number} The bits.
     */
    tProto.peekBits = function(pNumber) {
      var tByteIndex = this.tell(),
          tBitBuffer = this._bitBuffer,
          tBitBufferLength = this._bitBufferLength;

      var tTmp = 0;

      while (tBitBufferLength < pNumber) {
        tTmp = this.getUint8();

        tBitBuffer = (tBitBuffer << 8) | tTmp;
        tBitBufferLength += 8;
      }

      tTmp = tBitBuffer >>> (tBitBufferLength - pNumber);

      this.seekTo(tByteIndex);

      return tTmp;
    };

    /**
     * Reads bits.
     * @param {number} pNumber The number of bits to read.
     * @return {number} The bits.
     */
    tProto.getUBits = function(pNumber) {
      var tByteIndex = this.tell(),
          tBitBuffer = this._bitBuffer,
          tBitBufferLength = this._bitBufferLength;

      var tByteLength = 8;
      var tResult = tBitBuffer;

      while (tBitBufferLength + tByteLength < pNumber) {

        tBitBuffer = this.getUint8();

        tResult = (tResult << tByteLength) | tBitBuffer;

        tBitBufferLength += tByteLength;
      }

      if (tBitBufferLength < pNumber) {
        tBitBuffer = this.getUint8();
        
        tResult = (tResult << (pNumber - tBitBufferLength)) | (tBitBuffer >>> (tBitBufferLength + tByteLength - pNumber));

        tBitBufferLength = tBitBufferLength + tByteLength - pNumber;

        tBitBuffer = tBitBuffer & ((1 << tBitBufferLength) - 1);

      } else {
        tResult = tBitBuffer >>> (tBitBufferLength - pNumber);

        tBitBufferLength -= pNumber;

        tBitBuffer &= ((1 << tBitBufferLength) - 1);
      }

      this._bitBuffer = tBitBuffer;
      this._bitBufferLength = tBitBufferLength;

      return tResult;
    };

    /**
     * Reads a signed number from bits.
     * @param {number} pNumber The number of bits to read.
     * @return {number} The bits.
     */
    tProto.getBits = function(pNumber) {
      var tResult = this.getUBits(pNumber);
      if (tResult >> (pNumber - 1)) {
        // TODO: Will this every be over 31?
        tResult -= 1 << pNumber;
      }
      return tResult;
    };

    /**
     * Reads a fixed point from bits with a precision of 8.
     * @param {number} pNumber The number of bits to read.
     * @return {number} The fixed point.
     */
    tProto.getFixedPoint8 = function(pNumber) {
      return this.getBits(pNumber) * 0.00390625;
    };

    /**
     * Reads a fixed point from bits with a precision of 16.
     * @param {number} pNumber The number of bits to read.
     * @return {number} The fixed point.
     */
    tProto.getFixedPoint16 = function(pNumber) {
      return this.getBits(pNumber) * 0.0000152587890625;
    };

    tProto.getInt16 = function() {
      return tSuperProto.getInt16.call(this, true);
    };

    tProto.getUint16 = function() {
      return tSuperProto.getUint16.call(this, true);
    };

    tProto.getInt32 = function() {
      return tSuperProto.getInt32.call(this, true);
    };

    tProto.getUint32 = function() {
      return tSuperProto.getUint32.call(this, true);
    };

    return SWFReader;
  })(benri.io.Reader);

  global.quickswf.SWFReader = SWFReader;

}(this));

/**
 * @author Yoshihiro Yamazaki
 *
 * Copyright (C) 2012 Yoshihiro Yamazaki
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.KERNINGRECORD = KERNINGRECORD;

  /**
   * @constructor
   * @class {quickswf.structs.KERNINGRECORD}
   */
  function KERNINGRECORD(pCode1, pCode2, pAdjustment) {
    this.code1 = pCode1;
    this.code2 = pCode2;
    this.adjustment = pAdjustment;
  }

  /**
   * Loads a KERNINGRECORD type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.KERNINGRECORD} The loaded KERNINGRECORD.
   */
  KERNINGRECORD.load = function(pReader, pFlagWideCodes) {
    var tCode1, tCode2, tAdjustment;

    if (pFlagWideCodes) {
      tCode1 = pReader.getUint16();
      tCode2 = pReader.getUint16();
    } else {
      tCode1 = pReader.getUint8();
      tCode2 = pReader.getUint8();
    }

    tAdjustment = pReader.getUint16();

    return new KERNINGRECORD(tCode1, tCode2, tAdjustment);
  };

}(this));

/**
 * @author Yoshihiro Yamazaki
 *
 * Copyright (C) 2012 QuickSWF project
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.GLYPHENTRY = GLYPHENTRY;

  /**
   * @constructor
   * @class {quickswf.structs.GLYPHENTRY}
   */
  function GLYPHENTRY(pGlyphIndex, pGlyphAdvance) {
    this.index = pGlyphIndex;
    this.advance = pGlyphAdvance;
  }

  /**
   * Loads a GLYPHENTRY type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {number} pGlyphBits Bits in each glyph Index
   * @param {number} pAdvanceBits Bits in each advance value.
   * @return {quickswf.structs.GLYPHENTRY} The loaded GLYPHENTRY.
   */
  GLYPHENTRY.load = function(pReader, pGlyphBits, pAdvanceBits) {
    var tGlyphIndex = pReader.getUBits(pGlyphBits);
    var tGlyphAdvance = pReader.getUBits(pAdvanceBits);

    return new GLYPHENTRY(tGlyphIndex, tGlyphAdvance);
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.CLIPACTIONS = CLIPACTIONS;

  /**
   * @constructor
   * @class {quickswf.structs.CLIPACTIONS}
   */
  function CLIPACTIONS() {
    this.allEventFlags = 0;
    this.clipActionRecords = new Array();
  }

  /**
   * Loads a CLIPACTIONS type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {number} pVersion The version of this SWF.
   * @return {quickswf.structs.CLIPACTIONS} The loaded CLIPACTIONS.
   */
  CLIPACTIONS.load = function(pReader, pVersion) {
    var tActions = new CLIPACTIONS();

    pReader.getUint16(); // Reserved for nothing.

    if (pVersion <= 5) {
      tActions.allEventFlags = pReader.getUint16();
    } else {
      tActions.allEventFlags = pReader.getUint32();
    }

    for (;;) {
      if (pVersion <= 5) {
        if (pReader.getUint16() === 0) {
          break;
        } else {
          pReader.seek(-2); // wind backwards.
        }
      } else {
        if (pReader.getUint32() === 0) {
          break;
        } else {
          pReader.seek(-4); // wind backwards.
        }
      }

      var tEventFlags;
      if (pVersion <= 5) {
        tEventFlags = pReader.getUint16();
      } else {
        tEventFlags = pReader.getUint32();
      }

      var tActionRecordSize = pReader.getUint32();
      var tData = pReader.getCopy(tActionRecordSize);

      if (pVersion >= 6) {
        // check for keypress and do U8
      }

      tActions.clipActionRecords.push({
        eventFlags: tEventFlags,
        action: tData
      });
    }

    return tActions;
  };

}(this));


/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.RGBA = RGBA;

  /**
   * @constructor
   * @class {quickswf.structs.RGBA}
   */
  function RGBA(pRed, pGreen, pBlue, pAlpha) {
    this.red = pRed;
    this.green = pGreen;
    this.blue = pBlue;
    this.alpha = pAlpha;
  }

  RGBA.prototype.toString = function() {
    return 'rgba(' +
      this.red +
      ',' +
      this.green +
      ',' +
      this.blue +
      ',' +
      this.alpha +
      ')';
  };

  /**
   * Loads a colour RGBA type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha If this structure has alpha or not.
   * @return {quickswf.structs.RGBA} The loaded RGBA.
   */
  RGBA.load = function(pReader, pWithAlpha) {
    return new RGBA(
      pReader.getUint8(),
      pReader.getUint8(),
      pReader.getUint8(),
      pWithAlpha ? pReader.getUint8() / 255 : 1.0
    );
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.LINESTYLE = LINESTYLE;
  var RGBA = global.quickswf.structs.RGBA;

  /**
   * @constructor
   * @class {quickswf.structs.LINESTYLE}
   */
  function LINESTYLE(pIsMorph) {
    if (pIsMorph) {
      this.startWidth = 0;
      this.endWidth = 0;
      this.startColor = null;
      this.endColor = null;
    } else {
      this.width = 0;
      this.color = null;
    }
  }

  /**
   * Loads a LINESTYLE type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha True if alpha needs to be parsed.
   * @param {bool} pIsMorph True if morph shape.
   * @return {quickswf.structs.LINESTYLE} The loaded LINESTYLE.
   */
  LINESTYLE.load = function(pReader, pWithAlpha, pIsMorph) {
    var tLineStyle = new LINESTYLE(pIsMorph);

    if (pIsMorph) {
      tLineStyle.startWidth = pReader.getUint16();
      tLineStyle.endWidth = pReader.getUint16();
      tLineStyle.startColor = RGBA.load(pReader, pWithAlpha);
      tLineStyle.endColor = RGBA.load(pReader, pWithAlpha);
    } else {
      tLineStyle.width = pReader.getUint16();
      tLineStyle.color = RGBA.load(pReader, pWithAlpha);
    }

    return tLineStyle;
  };

  /**
   * Loads an array of LINESTYLE types.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha True if alpha needs to be parsed.
   * @param {bool} pHasLargeFillCount True if this struct can have more than 256 styles.
   * @param {bool} pIsMorph True if morph shape.
   * @return {Array.<quickswf.structs.LINESTYLE>} The loaded LINESTYLE array.
   */
  LINESTYLE.loadMultiple = function(pReader, pWithAlpha, pHasLargeFillCount, pIsMorph) {
    var tCount = pReader.getUint8();

    if (pHasLargeFillCount && tCount === 0xFF) {
      tCount = pReader.getUint16();
    }

    var tArray = new Array(tCount);

    for (var i = 0; i < tCount; i++) {
      tArray[i] = LINESTYLE.load(pReader, pWithAlpha, pIsMorph);
    }

    return tArray;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.GRADIENT = GRADIENT;
  global.quickswf.structs.Stop = Stop;

  var RGBA = global.quickswf.structs.RGBA;

  /**
   * @constructor
   * @class {quickswf.structs.GRADIENT}
   */
  function GRADIENT() {
    this.spreadMode = 0;
    this.interpolationMode = 0;
    this.stops = new Array();
    this.focalPoint = 0.0;
  }

  /**
   * @constructor
   * @private
   * @param {bool} pIsMorph True if morph shape.
   */
  function Stop(pIsMorph) {
    if (pIsMorph) {
      this.startRatio = 0;
      this.startColor = null;
      this.endRatio = 0;
      this.endColor = null;
    } else {
      this.ratio = 0;
      this.color = null;
    }
  }

  /**
   * Loads a GRADIENT type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha True if we need to parse colour.
   * @param {bool} pIsMorph True if morph shape.
   * @return {quickswf.structs.GRADIENT} The loaded GRADIENT.
   */
  GRADIENT.load = function(pReader, pWithAlpha, pIsMorph) {
    var tGradient = new GRADIENT();

    tGradient.spreadMode = pReader.getUBits(2);
    tGradient.interpolationMode = pReader.getUBits(2);
    var tStops = tGradient.stops;
    var tCount = tStops.length = pReader.getUBits(4);
    var tStop;

    for (var i = 0; i < tCount; i++) {
      tStop = new Stop(pIsMorph);

      if (pIsMorph) {
        tStop.startRatio = pReader.getUint8();
        tStop.startColor = RGBA.load(pReader, true);
        tStop.endRatio = pReader.getUint8();
        tStop.endColor = RGBA.load(pReader, true);
      } else {
        tStop.ratio = pReader.getUint8();
        tStop.color = RGBA.load(pReader, pWithAlpha);
      }

      tStops[i] = tStop;
    }

    return tGradient;
  };

}(this));

/**
 * @author Yoshihiro Yamazaki
 *
 * Copyright (C) 2012 QuickSWF project
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mStruct = global.quickswf.structs;
  mStruct.TEXTRECORD = TEXTRECORD;
  var RGBA = mStruct.RGBA;
  var GLYPHENTRY = mStruct.GLYPHENTRY;

  /**
   * @constructor
   * @class {quickswf.structs.TEXTRECORD}
   */
  function TEXTRECORD() {
    this.type = 0;
    this.styleflags = 0;
    this.id = -1;
    this.color = null;
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.xAdvance = 0;
    this.glyphs = null;
  }

  /**
   * Loads a TEXTRECORD type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {number} p_1stB First byte of TextRecord.
   * @param {bool} pWithAlpha True if parsing alpha is needed.
   * @param {number} pGlyphBits Bits in each glyph Index
   * @param {number} pAdvanceBits Bits in each advance value.
   * @param {quickswf.structs.Text} pText DefineText object which has this TEXTRECORD.
   * @return {quickswf.structs.TEXTRECORD} The loaded TEXTRECORD.
   */
  TEXTRECORD.load = function(pReader, p_1stB, pWithAlpha, pGlyphBits, pAdvanceBits, pText) {
    var tTextRecordType = p_1stB >>> 7;
    var tStyleFlags = p_1stB;
    var tTextColor = null;

    if (tStyleFlags & 0x08) { // StyleFlagsHasFont
      pText.fontID = pReader.getUint16();
    }
    if (tStyleFlags & 0x04) { // StyleFlagsHasColor
      pText.textColor = RGBA.load(pReader, pWithAlpha);
    }
    if (tStyleFlags & 0x01) { // StyleFlagsHasXOffset
      pText.xOffset = pReader.getUint16();
      pText.xAdvance = 0;
    }
    if (tStyleFlags & 0x02) { // StyleFlagsHasYOffset
      pText.yOffset = pReader.getUint16();
    }
    if (tStyleFlags & 0x08) { // StyleFlagsHasFont
      pText.textHeight = pReader.getUint16();
    }

    var tTEXTRECORD = new TEXTRECORD;

    tTEXTRECORD.type = tTextRecordType;
    tTEXTRECORD.styleflags = tStyleFlags;
    tTEXTRECORD.id = pText.fontID;
    tTEXTRECORD.color = pText.textColor;
    tTEXTRECORD.x = pText.xOffset;
    tTEXTRECORD.y = pText.yOffset;
    tTEXTRECORD.height = pText.textHeight;
    tTEXTRECORD.xAdvance = pText.xAdvance;

    var tGlyphCount = pReader.getUint8();
    var tGlypyEntries = new Array(tGlyphCount);

    for (var i = 0; i < tGlyphCount; i++) {
      tGlypyEntries[i] = GLYPHENTRY.load(pReader, pGlyphBits, pAdvanceBits);
      pText.xAdvance += tGlypyEntries[i].advance;
    }

    tTEXTRECORD.glyphs = tGlypyEntries;

    pReader.align();

    return tTEXTRECORD;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.RECT = RECT;

  /**
   * @constructor
   * @class {quickswf.structs.RECT}
   */
  function RECT(pLeft, pRight, pTop, pBottom) {
    this.left = pLeft;
    this.right = pRight;
    this.top = pTop;
    this.bottom = pBottom;
  }

  RECT.prototype.move = function (pXOffset, pYOffset) {
    this.left   += pXOffset;
    this.right  += pXOffset;
    this.top    += pYOffset;
    this.bottom += pYOffset;
  };

  RECT.prototype.clone  = function () {
    return new RECT(this.left, this.right, this.top, this.bottom);
  };

  /**
   * Loads a RECT type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.RECT} The loaded RECT.
   */
  RECT.load = function(pReader) {
    var tNumberOfBits = pReader.getUBits(5);
    var tLeft = pReader.getBits(tNumberOfBits);
    var tRight = pReader.getBits(tNumberOfBits);
    var tTop = pReader.getBits(tNumberOfBits);
    var tBottom = pReader.getBits(tNumberOfBits);

    pReader.align();

    return new RECT(tLeft, tRight, tTop, tBottom);
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.MATRIX = MATRIX;

  /**
   * @constructor
   * @extends {Array}
   * @class {quickswf.structs.MATRIX}
   */
  function MATRIX() {

  }

  MATRIX.prototype = [1, 0, 0, 1, 0, 0];

  /**
   * Loads a MATRIX type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.MATRIX} The loaded MATRIX.
   */
  MATRIX.load = function(pReader) {
    var tMatrix = new MATRIX();
    var tNumberOfBits;

    // Check to see if we have scale.
    if (pReader.getUBits(1) === 1) {
      tNumberOfBits = pReader.getUBits(5);
      tMatrix[0] = pReader.getFixedPoint16(tNumberOfBits);
      tMatrix[3] = pReader.getFixedPoint16(tNumberOfBits);
    }

    // Check to see if we have skew.
    if (pReader.getUBits(1) === 1) {
      tNumberOfBits = pReader.getUBits(5);
      tMatrix[1] = pReader.getFixedPoint16(tNumberOfBits);
      tMatrix[2] = pReader.getFixedPoint16(tNumberOfBits);
    }

    // Grab the translation.
    tNumberOfBits = pReader.getUBits(5);
    tMatrix[4] = pReader.getBits(tNumberOfBits);
    tMatrix[5] = pReader.getBits(tNumberOfBits);

    pReader.align();

    return tMatrix;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mStructs = global.quickswf.structs;
  mStructs.FILLSTYLE = FILLSTYLE;
  var RGBA = mStructs.RGBA;
  var MATRIX = mStructs.MATRIX;
  var GRADIENT = mStructs.GRADIENT;

  /**
   * @constructor
   * @class {quickswf.structs.FILLSTYLE}
   */
  function FILLSTYLE(pIsMorph) {
    if (pIsMorph) {
      this.type = 0;
      this.startColor = null;
      this.endColor = null;
      this.startMatrix = null;
      this.endMatrix = null;
      this.gradient = null;
      this.bitmapId = null;
    } else {
      this.type = 0;
      this.color = null;
      this.matrix = null;
      this.gradient = null;
      this.bitmapId = null;
    }
  }

  /**
   * Loads a FILLSTYLE type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha True if alpha needs to be parsed.
   * @param {bool} pIsMorph True if morph shape.
   * @return {quickswf.structs.FILLSTYLE} The loaded FILLSTYLE.
   */
  FILLSTYLE.load = function(pReader, pWithAlpha, pIsMorph) {
    var tFillStyle = new FILLSTYLE(pIsMorph);
    var tType = tFillStyle.type = pReader.getUint8();

    switch (tType) {
      case 0x00: // Solid fill
        if (pIsMorph) {
          tFillStyle.startColor = RGBA.load(pReader, pWithAlpha);
          tFillStyle.endColor = RGBA.load(pReader, pWithAlpha);
        } else {
          tFillStyle.color = RGBA.load(pReader, pWithAlpha);
        }
        break;
      case 0x10: // Linear gradient fill
      case 0x12: // Radial gradient fill
      case 0x13: // Focal radial gradient fill
        if (pIsMorph) {
          tFillStyle.startMatrix = MATRIX.load(pReader);
          tFillStyle.endMatrix = MATRIX.load(pReader);
        } else {
          tFillStyle.matrix = MATRIX.load(pReader);
        }

        tFillStyle.gradient = GRADIENT.load(pReader, pWithAlpha, pIsMorph);

        if (tType === 0x13) {
          tFillStyle.gradient.focalPoint = pReader.getFixedPoint8(16);
        }

        break;
      case 0x40: // Repeating bitmap fill
      case 0x41: // Clipped bitmap fill
      case 0x42: // Non-smoothed repeating bitmap
      case 0x43: // Non-smoothed clipped bitmap
        tFillStyle.bitmapId = pReader.getUint16();

        if (pIsMorph) {
          tFillStyle.startMatrix = MATRIX.load(pReader);
          tFillStyle.endMatrix = MATRIX.load(pReader);
        } else {
          tFillStyle.matrix = MATRIX.load(pReader);
        }
        if (tFillStyle.bitmapId === 0xFFFF) {
          tFillStyle.color = new RGBA(255, 0, 0, 1);
          tFillStyle.type = 0;

          if (pIsMorph) {
            tFillStyle.startMatrix = null;
            tFillStyle.endMatrix = null;
          } else {
            tFillStyle.matrix = null;
          }

          tFillStyle.bitmapId = null;

          break;
        }

        if (tType === 0x42 || tType === 0x43) {
          quickswf.logger.warn('Non-smoothed bitmaps are not supported');
        }

        break;
      default:
        quickswf.logger.warn('Unknown fill style type: ' + tType);
        return;
    }

    return tFillStyle;
  };

  /**
   * Loads an array of FILLSTYLE types.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha True if alpha needs to be parsed.
   * @param {bool} pHasLargeFillCount True if this struct can have more than 256 styles.
   * @param {bool} pIsMorph True if morph shape.
   * @return {Array.<quickswf.structs.FILLSTYLE>} The loaded FILLSTYLE array.
   */
  FILLSTYLE.loadMultiple = function(pReader, pWithAlpha, pHasLargeFillCount, pIsMorph) {
    var tCount = pReader.getUint8();

    if (pHasLargeFillCount && tCount === 0xFF) {
      tCount = pReader.getUint16();
    }

    var tArray = new Array(tCount);

    for (var i = 0; i < tCount; i++) {
      tArray[i] = FILLSTYLE.load(pReader, pWithAlpha, pIsMorph);
    }

    return tArray;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mStructs = global.quickswf.structs;
  mStructs.SHAPERECORD = SHAPERECORD;
  mStructs.EDGERECORD = EDGERECORD;
  mStructs.STYLECHANGERECORD = STYLECHANGERECORD;
  var FILLSTYLE = mStructs.FILLSTYLE;
  var LINESTYLE = mStructs.LINESTYLE;

  /**
   * @constructor
   * @class {quickswf.structs.SHAPERECORD}
   */
  function SHAPERECORD() {

  }

  /**
   * Loads a SHAPERECORD type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.SHAPERECORD} The loaded SHAPERECORD.
   */
  SHAPERECORD.load = function(pReader) {
    var tShapeRecord = new SHAPERECORD();

    return tShapeRecord;
  };

  /**
   * Loads multple SHAPERECORDs.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {quickswf.Shape} pShape The Shape these SHAPERECORDs belong to.
   * @param {bool} pWithAlpha True if parsing alpha is needed.
   * @param {bool} pIsMorph True if morph shape.
   * @return {Array.<quickswf.structs.SHAPERECORD>} The loaded SHAPERECORDs.
   */
  SHAPERECORD.loadMultiple = function(pReader, pShape, pWithAlpha, pIsMorph) {
    var tRecords = new Array();
    var i = 0;
    var tStyleChanged;

    for (;;) {
      if (pReader.getUBits(1) === 0) { // Is edge flag
        if (pReader.peekBits(5) === 0) { // End of records.
          pReader.getUBits(5);

          break;
        } else {
          tStyleChanged = tRecords[i++] = parseStyleChanged(pReader, pShape.numberOfFillBits, pShape.numberOfLineBits, pWithAlpha, pIsMorph);
          pShape.numberOfFillBits = tStyleChanged.fillBits;
          pShape.numberOfLineBits = tStyleChanged.lineBits;
        }
      } else {
        if (pReader.getUBits(1) === 1) { // Is straight record
          tRecords[i++] = parseStraightEdge(pReader);
        } else {
          tRecords[i++] = parseCurvedEdge(pReader);
        }
      }
    }

    pReader.align();

    return tRecords;
  };

  function EDGERECORD(pType, pDeltaX, pDeltaY, pDeltaControlX, pDeltaControlY) {
    this.type = pType;
    this.deltaX = pDeltaX;
    this.deltaY = pDeltaY;
    this.deltaControlX = pDeltaControlX;
    this.deltaControlY = pDeltaControlY;
  }

  function STYLECHANGERECORD(pNumberOfFillBits, pNumberOfLineBits) {
    this.type = 1;
    this.hasMove = false;
    this.moveDeltaX = 0;
    this.moveDeltaY = 0;
    this.fillStyle0 = -1;
    this.fillStyle1 = -1;
    this.lineStyle = -1;
    this.fillBits = pNumberOfFillBits;
    this.lineBits = pNumberOfLineBits;
    this.fillStyles = null;
    this.lineStyles = null;
  }

  function parseStraightEdge(pReader) {
    var tNumberOfBits = pReader.getUBits(4) + 2;
    var tGeneralLineFlag = pReader.getUBits(1);
    var tVerticalLineFlag = 0;

    if (tGeneralLineFlag === 0) {
      tVerticalLineFlag = pReader.getUBits(1);
    }

    var tDeltaX = 0;
    var tDeltaY = 0;

    if (tGeneralLineFlag === 1 || tVerticalLineFlag === 0) {
      tDeltaX = pReader.getBits(tNumberOfBits);
    }

    if (tGeneralLineFlag === 1 || tVerticalLineFlag === 1) {
      tDeltaY = pReader.getBits(tNumberOfBits);
    }

    return new EDGERECORD(3, tDeltaX, tDeltaY, 0, 0);
  }

  function parseCurvedEdge(pReader) {
    var tNumberOfBits = pReader.getUBits(4) + 2;
    var tDeltaControlX = pReader.getBits(tNumberOfBits);
    var tDeltaControlY = pReader.getBits(tNumberOfBits);
    var tDeltaX = pReader.getBits(tNumberOfBits);
    var tDeltaY = pReader.getBits(tNumberOfBits);

    return new EDGERECORD(2, tDeltaX, tDeltaY, tDeltaControlX, tDeltaControlY);
  }

  function parseStyleChanged(pReader, pNumberOfFillBits, pNumberOfLineBits, pWithAlpha, pIsMorph) {
    var tNewStyles = pReader.getUBits(1);
    var tNewLineStyle = pReader.getUBits(1);
    var tNewFillStyle1 = pReader.getUBits(1);
    var tNewFillStyle0 = pReader.getUBits(1);
    var tNewMoveTo = pReader.getUBits(1);

    var tResult = new STYLECHANGERECORD(pNumberOfFillBits, pNumberOfLineBits);

    if (tNewMoveTo === 1) {
      var tMoveBits = pReader.getUBits(5);
      tResult.hasMove = true;
      tResult.moveDeltaX = pReader.getBits(tMoveBits);
      tResult.moveDeltaY = pReader.getBits(tMoveBits);
    }

    if (tNewFillStyle0 === 1) {
      tResult.fillStyle0 = pReader.getUBits(pNumberOfFillBits);
    }

    if (tNewFillStyle1 === 1) {
      tResult.fillStyle1 = pReader.getUBits(pNumberOfFillBits);
    }

    if (tNewLineStyle === 1) {
      tResult.lineStyle = pReader.getUBits(pNumberOfLineBits);
    }

    if (tNewStyles === 1) {
      pReader.align();
      tResult.fillStyles = FILLSTYLE.loadMultiple(pReader, pWithAlpha, true, pIsMorph);
      tResult.lineStyles = LINESTYLE.loadMultiple(pReader, pWithAlpha, true, pIsMorph);
      pReader.align();
      tResult.fillBits = pReader.getUBits(4);
      tResult.lineBits = pReader.getUBits(4);
    }

    return tResult;
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.structs.CXFORM = CXFORM;

  /**
   * @constructor
   * @class {quickswf.structs.CXFORM}
   */
  function CXFORM() {
    this.rm = 256;
    this.gm = 256;
    this.bm = 256;
    this.am = 256;

    this.ra = 0;
    this.ga = 0;
    this.ba = 0;
    this.aa = 0;
  }

  CXFORM.prototype.clone = function() {
    var tColorTransform = new CXFORM();

    tColorTransform.rm = this.rm;
    tColorTransform.gm = this.gm;
    tColorTransform.bm = this.bm;
    tColorTransform.am = this.am;

    tColorTransform.ra = this.ra;
    tColorTransform.ga = this.ga;
    tColorTransform.ba = this.ba;
    tColorTransform.aa = this.aa;

    return tColorTransform;
  }

  CXFORM.prototype.equals = function(pThat) {
    if (pThat
      && this.rm === pThat.rm
      && this.gm === pThat.gm
      && this.bm === pThat.bm
      && this.am === pThat.am
      && this.ra === pThat.ra
      && this.ga === pThat.ga
      && this.ba === pThat.ba
      && this.aa === pThat.aa) {
      return true;
    }
    return false;
  }

  /**
   * Loads a CXFORM type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha If this struct has alpha to load.
   * @return {quickswf.structs.CXFORM} The loaded CXFORM.
   */
  CXFORM.load = function(pReader, pWithAlpha) {
    var tHasAdditive = pReader.getUBits(1);
    var tHasMultiplitive = pReader.getUBits(1);
    var tNumberOfBits = pReader.getUBits(4);

    var tTransform = new CXFORM();

    if (tHasMultiplitive === 1) {
      tTransform.rm = pReader.getBits(tNumberOfBits);
      tTransform.gm = pReader.getBits(tNumberOfBits);
      tTransform.bm = pReader.getBits(tNumberOfBits);
      if (pWithAlpha === true) {
        tTransform.am = pReader.getBits(tNumberOfBits);
      }
    }

    if (tHasAdditive === 1) {
      tTransform.ra = pReader.getBits(tNumberOfBits);
      tTransform.ga = pReader.getBits(tNumberOfBits);
      tTransform.ba = pReader.getBits(tNumberOfBits);
      if (pWithAlpha === true) {
        tTransform.aa = pReader.getBits(tNumberOfBits);
      }
    }

    pReader.align();

    return tTransform;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var bugs = {};

  benri.impl.web.graphics = {
    bugs: bugs
  };

  /** @const @type {boolean} */
  bugs.putImageDataAlphaBug = detectPutImageDataBug();

  /** @const @type {boolean} */
  bugs.repeatPatternBug = detectRepeatPatternBug();

  /** @const @type {boolean} */
  bugs.canvasSizeBug = detectCanvasSizeBug();

  /**
   * @return {boolean}
   */
  function detectPutImageDataBug() {
    /** @type {HTMLCanvasElement} */
    var tCanvas = document.createElement('canvas');
    /** @type {CanvasRenderingContext2D} */
    var tContext = tCanvas.getContext('2d');
    /** @type {ImageData} */
    var tImageData;
    /** @type {!(CanvasPixelArray|Uint8ClampedArray)} */
    var tPixelArray;

    tCanvas.width = tCanvas.height = 1;
    tImageData = tContext.createImageData(1, 1);
    tPixelArray = tImageData.data;

    tPixelArray[0] = tPixelArray[3] = 128;

    tContext.putImageData(tImageData, 0, 0);
    tImageData = tContext.getImageData(0, 0, 1, 1);
    tPixelArray = tImageData.data;

    return (tPixelArray[0] === 255);
  }

  function detectRepeatPatternBug() {
    var tPatternCanvas = document.createElement('canvas');
    tPatternCanvas.width = 1;
    // iOS doesn't care about the size, but Chrome
    // needs width or height to be larger than the other.
    tPatternCanvas.height = 3;
    var tPatternContext = tPatternCanvas.getContext('2d');

    tPatternContext.fillStyle = 'red';
    tPatternContext.fillRect(0, 0, 1, 3);

    var tCanvas = document.createElement('canvas');

    // iOS needs to be above 5000 total pixels,
    // Chrome needs to be a box larger than 256 (the render square).
    tCanvas.width = 257;
    tCanvas.height = 257;

    var tContext = tCanvas.getContext('2d');
    var tPattern = tContext.createPattern(tPatternCanvas, 'repeat');

    tContext.fillStyle = tPattern;

    tContext.setTransform(1.1, 0, 0, 1.1, 0, 0);
    tContext.fillRect(0, 0, 257, 257);

    return (tContext.getImageData(1, 0, 1, 1).data[0] !== 255);
  }

  function detectCanvasSizeBug() {
    // sadly, we actually can't detect this
    // so we guess based upon the existence
    // of other bugs (this is not 100% accurate).
    
    return detectPutImageDataBug();
  }

  benri.env.on('setvar', function(pEvent) {
    if (pEvent.varName === 'benri.impl.web.graphics.canvasSizeBug') {
      bugs.canvasSizeBug = pEvent.varValue;
    }
  });

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.graphics.shader = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.graphics.shader.fragment = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var mHasBitmapPatternGapIssue = benri.impl.web.graphics.bugs.repeatPatternBug;


  benri.impl.web.graphics.shader.fragment.ImageShader = {
    pre: function(pShader, pSurface, pProgram) {
      var tImage = pShader.getImage();
      var tSrcWidth = tImage.getWidth();
      var tSrcHeight = tImage.getHeight();
      var tTileMode = pShader.getTileMode();

      pProgram.fillData = {
        image: tImage.domImage,
        matrix: pShader.getMatrix(),
        tileMode: tTileMode,
        width: tSrcWidth,
        height: tSrcHeight,
        srcX: 0,
        srcY: 0,
        srcWidth: tSrcWidth,
        srcHeight: tSrcHeight
      };
    },

    style: function(pShader, pSurface, pProgram) {
      var tContext = pSurface.context;
      var tFillData = pProgram.fillData;
      var tSurfaceMatrix;
      var tMatrix;
      var tImage = tFillData.image;

      pSurface.saveContext();

      if (tFillData.tileMode === 'none') {
        if (tFillData.drawnOnSurface) {
          return true;
        }

        tSurfaceMatrix = pProgram.matrix;
        tMatrix = pShader.getMatrix();

        tContext.clip();

        pSurface.setTransform(
          tSurfaceMatrix.a,
          tSurfaceMatrix.b,
          tSurfaceMatrix.c,
          tSurfaceMatrix.d,
          tSurfaceMatrix.e,
          tSurfaceMatrix.f
        );
        pSurface.transform(tMatrix.a, tMatrix.b, tMatrix.c, tMatrix.d, tMatrix.e, tMatrix.f);
        tContext.drawImage(tImage, 0, 0, tFillData.srcWidth, tFillData.srcHeight, 0, 0, tFillData.width, tFillData.height);

        return true;
      } else {
        tMatrix = pProgram.matrix.cloneAndAutoRelease().multiply(pShader.getMatrix());

        if (mHasBitmapPatternGapIssue) {
          tMatrix.setScaleX(Math.round(tImage.width * tMatrix.getScaleX()) / tImage.width);
          tMatrix.setScaleY(Math.round(tImage.height * tMatrix.getScaleY()) / tImage.height);
        }

        pSurface.setTransform(
          tMatrix.a,
          tMatrix.b,
          tMatrix.c,
          tMatrix.d,
          tMatrix.e,
          tMatrix.f
        );
        tContext[pProgram.fillTypeText] = tContext.createPattern(tImage, 'repeat');
      }

      return false;
    },

    post: function(pShader, pSurface, pProgram) {
      pSurface.restoreContext();
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Records = benri.graphics.Records;
  var Color = benri.graphics.draw.Color;

  var mHaveMultiplyMode;

  benri.impl.web.graphics.shader.fragment.ColorTransformShader = {
    pre: function(pShader, pSurface, pProgram) {
      var tFillType = pProgram.fillType;

      /*if (pShader.getGlobalAlpha().alphaOnly) {
        return;
      }*/

      if (!pShader.checkColorTransformAccessed()) {
        pShader.updateFlags();
      }


      var tHasAlpha = pShader.hasAlpha;
      var tHasColors = pShader.hasColors;

      if (!tHasAlpha && !tHasColors) {
        // Nothing to do.
        return;
      }

      var tContext = pSurface.context;

      if (tHasAlpha && !tHasColors && pShader.alphaAdd === 0) {
        // We can just do alpha here.
        pShader.previousAlpha = tContext.globalAlpha;
        tContext.globalAlpha = pShader.alphaMultiplier;
        // Is this part still necessary since we have AlphaShader?
        return;
      }

      var tFillData = pProgram.fillData;
      var tColors = pProgram.colors;
      var i;
      var il = tColors.length;
      var tIsTargetFresh = pSurface.isTargetFresh();

      if (il === 0) {
        // We need to pixel process this.
        if (tFillType === Records.RAW) {
          // Set up a composite canvas.
          pSurface.pushCompositeCanvas(tFillData.width, tFillData.height, true);
        } else {
          var tImageData = tFillData.image;
          var tMatrix = tFillData.matrix;
          var tSrcWidth = tFillData.srcWidth;
          var tSrcHeight = tFillData.srcHeight;
          var tSurfaceMatrix = pProgram.matrix;
          var tIsNoneTileMode = tFillData.tileMode === 'none';

          if (!tIsTargetFresh || !tIsNoneTileMode) {
            var tTargetWidth;
            var tTargetHeight;
            var tFinalScale = Math.max(
              Math.abs(tSurfaceMatrix.getScaleX() * tMatrix.getScaleX()),
              Math.abs(tSurfaceMatrix.getScaleY() * tMatrix.getScaleY())
            );

            if (tFinalScale >= 1 || !tIsNoneTileMode) {
              tTargetWidth = tSrcWidth;
              tTargetHeight = tSrcHeight;
            } else {
              tTargetWidth = tSrcWidth * tFinalScale;
              tTargetHeight = tSrcHeight * tFinalScale;

              if (tTargetWidth < 1) {
                tTargetHeight = tTargetHeight / tTargetWidth;
                tTargetWidth = 1;
              }
              if (tTargetHeight < 1) {
                tTargetWidth = tTargetWidth / tTargetHeight;
                tTargetHeight = 1;
              }
            }

            tFillData.width = tTargetWidth;
            tFillData.height = tTargetHeight;

            pSurface.pushCompositeCanvas(tTargetWidth, tTargetHeight, tIsNoneTileMode);

            pSurface.context.drawImage(tImageData, 0, 0, tSrcWidth, tSrcHeight, 0, 0, tTargetWidth, tTargetHeight);

            transformPixels(tImageData, pShader, pSurface, pProgram);

            var tImage = pSurface.takeCompositeCanvas();

            tFillData.image = tImage.domImage;
            tFillData.srcWidth = tTargetWidth;
            tFillData.srcHeight = tTargetHeight;
            tFillData.width = tSrcWidth;
            tFillData.height = tSrcHeight;

            pShader.toDestroyImage = tImage;
          } else {
            tContext = pSurface.context;
            pSurface.saveContext();
            tContext.clip();

            pSurface.setTransform(
              tSurfaceMatrix.a,
              tSurfaceMatrix.b,
              tSurfaceMatrix.c,
              tSurfaceMatrix.d,
              tSurfaceMatrix.e,
              tSurfaceMatrix.f
            );
            pSurface.transform(tMatrix.a, tMatrix.b, tMatrix.c, tMatrix.d, tMatrix.e, tMatrix.f);

            tContext.drawImage(tImageData, 0, 0, tSrcWidth, tSrcHeight, 0, 0, tSrcWidth, tSrcHeight);

            transformPixels(tImageData, pShader, pSurface, pProgram);
            pSurface.restoreContext();

            pShader.transformFinished = true;

            pSurface.setTargetFresh(false);
            
            tFillData.drawnOnSurface = true;
          }

        }

        return;
      }

      var tColor;
      var tRGBA;

      var tAlphaAdd = pShader.alphaAdd;
      var tAlphaMultiplier = pShader.alphaMultiplier;
      var tRedAdd = pShader.redAdd;
      var tRedMultiplier = pShader.redMultiplier;
      var tGreenAdd = pShader.greenAdd;
      var tGreenMultiplier = pShader.greenMultiplier;
      var tBlueAdd = pShader.blueAdd;
      var tBlueMultiplier = pShader.blueMultiplier;

      for (i = 0, il = tColors.length; i < il; i++) {
        tColor = tColors[i];
        tRGBA = tColor.getRGBA();

        tRGBA[0] = Math.min(255, Math.max(0, (tRGBA[0] * tRedMultiplier + tRedAdd) | 0));
        tRGBA[1] = Math.min(255, Math.max(0, (tRGBA[1] * tGreenMultiplier + tGreenAdd) | 0));
        tRGBA[2] = Math.min(255, Math.max(0, (tRGBA[2] * tBlueMultiplier + tBlueAdd) | 0));
        tRGBA[3] = Math.min(255, Math.max(0, (tRGBA[3] * tAlphaMultiplier + tAlphaAdd) | 0));

        tColors[i] = new Color(tRGBA[0], tRGBA[1], tRGBA[2], tRGBA[3]);
      }
    },

    post: function(pShader, pSurface, pProgram) {
      var tFillType = pProgram.fillType;
      var tAlphaMultiplier = pShader.alphaMultiplier;
      var tHasAlpha = pShader.hasAlpha;
      var tHasColors = pShader.hasColors;
      var tContext;
      var tPreviousAlpha;

      if (!tHasAlpha && !tHasColors) {
        // Nothing to do.
        return;
      }

      if (tHasAlpha && !tHasColors && pShader.alphaAdd === 0) {
        // We can just do alpha here.
        tContext = pSurface.context;
        tPreviousAlpha = pShader.previousAlpha;

        if (tContext.globalAlpha !== tPreviousAlpha) {
          tContext.globalAlpha = tPreviousAlpha;
        }
        
        return;
      }

      if (pShader.transformFinished) {
        pShader.transformFinished = false;

        return;
      }


      if (pShader.toDestroyImage) {
        // We've already done stuff in pre.
        pShader.toDestroyImage.destroy();
        pShader.toDestroyImage = null;

        return;
      }

      var tColors = pProgram.colors;

      if (tColors.length > 0) {
        // Already did transforms to vectors!
        return;
      }

      //transformPixels(pProgram.fillData.image, pShader, pSurface, pProgram);

      if (tFillType === Records.RAW) {
        pSurface.popCompositeCanvas(tAlphaMultiplier, 'source-over');
      }
    }
  };

  function transformPixels(pImage, pShader, pSurface, pProgram) {
    // Process by pixel.
    var tFillData = pProgram.fillData;
    var tTargetContext = pSurface.context;
    var tWidth = tFillData.width;
    var tHeight = tFillData.height;
    var tSrcWidth = tFillData.srcWidth;
    var tSrcHeight = tFillData.srcHeight;
    var tTargetX = tFillData.x || 0;
    var tTargetY = tFillData.y || 0;

    var tAlphaAdd = pShader.alphaAdd;
    var tAlphaMultiplier = pShader.alphaMultiplier;
    var tRedAdd = pShader.redAdd;
    var tRedMultiplier = pShader.redMultiplier;
    var tGreenAdd = pShader.greenAdd;
    var tGreenMultiplier = pShader.greenMultiplier;
    var tBlueAdd = pShader.blueAdd;
    var tBlueMultiplier = pShader.blueMultiplier;

    var tHasAdds = pShader.hasAdds;

    var tHasRed = pShader.hasRed;
    var tHasGreen = pShader.hasGreen;
    var tHasBlue = pShader.hasBlue;

    var tHavePositiveAdds = tRedAdd >= 0 && tGreenAdd >= 0 && tBlueAdd >= 0;
    var tHaveMultipliers = tRedMultiplier * tGreenMultiplier * tBlueMultiplier !== 1;
    var tHavePositiveMultipliers = tRedMultiplier >= 0 && tGreenMultiplier >= 0 && tBlueMultiplier >= 0;
    var tHaveSameMultipliers = tHaveMultipliers && tRedMultiplier === tGreenMultiplier && tRedMultiplier === tBlueMultiplier;

    var tAllPixelsImageData = null;
    var tAllPixels = null;


    function doSetAll() {
      var tContext = tTargetContext;
      var tPreviousGlobalAlpha = tContext.globalAlpha;
      tContext.globalAlpha = 1;

      //pSurface.pushCompositeCanvas(tWidth, tHeight);

      //tContext = pSurface.context;
      
      var tPreviousCompositeOperation = tContext.globalCompositeOperation;

      tContext.globalCompositeOperation = 'source-atop';
      tContext.fillStyle = 'rgba(' + tRedAdd + ',' + tGreenAdd + ',' + tBlueAdd + ',1)';
      tContext.fillRect(tTargetX, tTargetY, tWidth, tHeight);
      tContext.globalCompositeOperation = tPreviousCompositeOperation;

      //pSurface.popCompositeCanvas(1, 'source-atop');

      tContext.globalAlpha = tPreviousGlobalAlpha;

      return false;
    }

    function doDarkenAllLighten() {
      var tContext = tTargetContext;
      var tMult = 1 - tRedMultiplier;
      var tPreviousGlobalAlpha = tContext.globalAlpha;
      var tPreviousCompositeOperation = tContext.globalCompositeOperation;

      tContext.globalAlpha = 1;
      tContext.globalCompositeOperation = 'source-atop';
      tContext.fillStyle = 'rgba(0,0,0,' + tMult + ')';
      tContext.fillRect(tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = 'lighter';
      tContext.fillStyle = 'rgba(' + tRedAdd + ',' + tGreenAdd + ',' + tBlueAdd + ',1)';
      tContext.fillRect(tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = 'destination-in';
      tContext.drawImage(pImage, 0, 0, tSrcWidth, tSrcHeight, tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = tPreviousCompositeOperation;
      tContext.globalAlpha = tPreviousGlobalAlpha;

      return false;
    }

    function doDarkenAll() {
      var tContext = tTargetContext;
      var tMult = 1 - tRedMultiplier;
      var tPreviousGlobalAlpha = tContext.globalAlpha;
      var tPreviousCompositeOperation = tContext.globalCompositeOperation;

      tContext.globalAlpha = 1;
      tContext.globalCompositeOperation = 'source-atop';
      tContext.fillStyle = 'rgba(0,0,0,' + tMult + ')';
      tContext.fillRect(tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = tPreviousCompositeOperation;
      tContext.globalAlpha = tPreviousGlobalAlpha;

      return false;
    }

    function canMultiply() {
      if (mHaveMultiplyMode !== void 0) {
        return mHaveMultiplyMode;
      }

      var tContext = tTargetContext;
      var tPreviousCompositeOperation = tContext.globalCompositeOperation;

      tContext.globalCompositeOperation = 'multiply';

      if (tContext.globalCompositeOperation === 'multiply') {
        tContext.globalCompositeOperation = tPreviousCompositeOperation;

        return (mHaveMultiplyMode = true);
      }

      return (mHaveMultiplyMode = false);
    }

    function doDarken() {
      var tContext = tTargetContext;
      var tMult = 1 - tRedMultiplier;
      var tPreviousGlobalAlpha = tContext.globalAlpha;
      var tPreviousCompositeOperation = tContext.globalCompositeOperation;

      tContext.globalAlpha = 1;
      tContext.globalCompositeOperation = 'multiply';
      tContext.fillStyle = 'rgba(' + ((tRedMultiplier * 255) | 0)  + ',' + ((tGreenMultiplier * 255) | 0)  + ',' + ((tBlueMultiplier * 255) | 0)  + ',1)';
      tContext.fillRect(tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = 'destination-in';
      tContext.drawImage(pImage, 0, 0, tSrcWidth, tSrcHeight, tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = tPreviousCompositeOperation;
      tContext.globalAlpha = tPreviousGlobalAlpha;

      return false;
    }

    function doDarkenLighten() {
      var tContext = tTargetContext;
      var tPreviousGlobalAlpha = tContext.globalAlpha;
      var tPreviousCompositeOperation = tContext.globalCompositeOperation;

      tContext.globalAlpha = 1;
      tContext.globalCompositeOperation = 'multiply';
      tContext.fillStyle = 'rgba(' + ((tRedMultiplier * 255) | 0)  + ',' + ((tGreenMultiplier * 255) | 0)  + ',' + ((tBlueMultiplier * 255) | 0)  + ',1)';
      tContext.fillRect(0, 0, tWidth, tHeight);

      tContext.globalCompositeOperation = 'lighter';
      tContext.fillStyle = 'rgba(' + tRedAdd + ',' + tGreenAdd + ',' + tBlueAdd + ',1)';
      tContext.fillRect(tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = 'destination-in';
      tContext.drawImage(pImage, 0, 0, tSrcWidth, tSrcHeight, tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = tPreviousCompositeOperation;
      tContext.globalAlpha = tPreviousGlobalAlpha;

      return false;
    }

    function doLightenAll() {
      var tContext = tTargetContext;
      var tPreviousGlobalAlpha = tContext.globalAlpha;
      var tPreviousCompositeOperation = tContext.globalCompositeOperation;

      tContext.globalAlpha = 1;
      tContext.globalCompositeOperation = 'lighter';

      // This is not perfect when alpha is involved.
      // Due to alpha premultiplication we have lots colours and can not
      // reproduce them. Need to find a work around this even though the result
      // is quite similar.
      tContext.fillStyle = 'rgba(' + tRedAdd + ',' + tGreenAdd + ',' + tBlueAdd + ',1)';
      tContext.fillRect(tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = 'destination-in';
      tContext.drawImage(pImage, 0, 0, tSrcWidth, tSrcHeight, tTargetX, tTargetY, tWidth, tHeight);

      tContext.globalCompositeOperation = tPreviousCompositeOperation;
      tContext.globalAlpha = tPreviousGlobalAlpha;

      return false;
    }

    function doAll() {
      tAllPixelsImageData = tTargetContext.getImageData(tTargetX, tTargetY, tWidth, tHeight);
      var tPixels = tAllPixels = tAllPixelsImageData.data;
      var tRM = tRedMultiplier;
      var tRA = tRedAdd;
      var tGM = tGreenMultiplier;
      var tGA = tGreenAdd;
      var tBM = tBlueMultiplier;
      var tBA = tBlueAdd;
      var tAM = tAlphaMultiplier;
      var tAA = tAlphaAdd;
      var tAlphaPixel;
      var tAlphaRatio;
      var tAlphaInverter

      if (benri.impl.web.graphics.bugs.putImageDataAlphaBug) {
        for (var i = 0, il = tPixels.length; i < il; i += 4) {
          tAlphaPixel = tPixels[i + 3];

          if (tAlphaPixel === 0) continue;

          if (tAlphaPixel === 255) {
            tPixels[i] = (tPixels[i] * tRM + tRA) | 0;
            tPixels[i + 1] = (tPixels[i + 1] * tGM + tGA) | 0;
            tPixels[i + 2] = (tPixels[i + 2] * tBM + tBA) | 0;
            tPixels[i + 3] = (tAlphaPixel * tAM + tAA) | 0;
          } else {
            tAlphaRatio = tAlphaPixel / 255;
            tAlphaInverter = 1 + (1 - tAlphaRatio);

            tPixels[i] = (tPixels[i] * tAlphaInverter * tRM * tAlphaRatio + tRA * tAlphaRatio) | 0;
            tPixels[i + 1] = (tPixels[i + 1] * tAlphaInverter * tGM * tAlphaRatio + tGA * tAlphaRatio) | 0;
            tPixels[i + 2] = (tPixels[i + 2] * tAlphaInverter * tBM * tAlphaRatio + tBA * tAlphaRatio) | 0;
            tPixels[i + 3] = (tAlphaPixel * tAM + tAA) | 0;
          }
        }
      } else {
        for (var i = 0, il = tPixels.length; i < il; i += 4) {
          tAlphaPixel = tPixels[i + 3];

          if (tAlphaPixel === 0) continue;

          tPixels[i] = (tPixels[i] * tRM + tRA) | 0;
          tPixels[i + 1] = (tPixels[i + 1] * tGM + tGA) | 0;
          tPixels[i + 2] = (tPixels[i + 2] * tBM + tBA) | 0;
          tPixels[i + 3] = (tAlphaPixel * tAM + tAA) | 0;
        }
      }
    }

    function doThree() {
      tAllPixelsImageData = tTargetContext.getImageData(tTargetX, tTargetY, tWidth, tHeight);
      var tPixels = tAllPixels = tAllPixelsImageData.data;
      var tRM = tRedMultiplier;
      var tRA = tRedAdd;
      var tGM = tGreenMultiplier;
      var tGA = tGreenAdd;
      var tBM = tBlueMultiplier;
      var tBA = tBlueAdd;

      if (benri.impl.web.graphics.bugs.putImageDataAlphaBug) {
        for (var i = 0, il = tPixels.length; i < il; i += 4) {
          tAlphaPixel = tPixels[i + 3];

          if (tAlphaPixel === 0) continue;

          if (tAlphaPixel === 255) {
            tPixels[i] = (tPixels[i] * tRM + tRA) | 0;
            tPixels[i + 1] = (tPixels[i + 1] * tGM + tGA) | 0;
            tPixels[i + 2] = (tPixels[i + 2] * tBM + tBA) | 0;
          } else {
            tAlphaRatio = tAlphaPixel / 255;
            tAlphaInverter = 1 + (1 - tAlphaRatio);
            
            tPixels[i] = (tPixels[i] * tAlphaInverter * tRM * tAlphaRatio + tRA * tAlphaRatio) | 0;
            tPixels[i + 1] = (tPixels[i + 1] * tAlphaInverter * tGM * tAlphaRatio + tGA * tAlphaRatio) | 0;
            tPixels[i + 2] = (tPixels[i + 2] * tAlphaInverter * tBM * tAlphaRatio + tBA * tAlphaRatio) | 0;
          }
        }
      } else {
        for (var i = 0, il = tPixels.length; i < il; i += 4) {
          if (tPixels[i + 3] === 0) continue;

          tPixels[i] = (tPixels[i] * tRM + tRA) | 0;
          tPixels[i + 1] = (tPixels[i + 1] * tGM + tGA) | 0;
          tPixels[i + 2] = (tPixels[i + 2] * tBM + tBA) | 0;
        }
      }
    }

    function doOneIndex(pIndex, pMultiplier, pAdd) {
      tAllPixelsImageData = tTargetContext.getImageData(tTargetX, tTargetY, tWidth, tHeight);
      var tPixels = tAllPixels = tAllPixelsImageData.data;
      var tAlphaIndex = 3 - pIndex;

      if (benri.impl.web.graphics.bugs.putImageDataAlphaBug) {
        for (var i = 0, il = tPixels.length; i < il; i += 4) {
          tAlphaPixel = tPixels[i + tAlphaIndex];

          if (tAlphaPixel === 0) continue;

          if (tAlphaPixel === 255) {
            tPixels[i] = (tPixels[i] * pMultiplier + pAdd) | 0;
          } else {
            tAlphaRatio = tAlphaPixel / 255;
            tAlphaInverter = 1 + (1 - tAlphaRatio);
            
            tPixels[i] = (tPixels[i] * tAlphaInverter * pMultiplier * tAlphaRatio + pAdd * tAlphaRatio) | 0;
          }
        }
      } else {
        for (var i = pIndex, il = tPixels.length; i < il; i += 4) {
          if (tPixels[i + tAlphaIndex] === 0) continue;

          tPixels[i] = (tPixels[i] * pMultiplier + pAdd) | 0;
        }
      }
    }

    function doTwoIndex(pIndex, pMultiplier, pAdd, pIndex2, pMultiplier2, pAdd2) {
      tAllPixelsImageData = tTargetContext.getImageData(tTargetX, tTargetY, tWidth, tHeight);
      var tPixels = tAllPixels = tAllPixelsImageData.data;
      var tAlphaIndex = 3 - pIndex;
      pIndex2 = pIndex2 - pIndex;

      if (benri.impl.web.graphics.bugs.putImageDataAlphaBug) {
        for (var i = 0, il = tPixels.length; i < il; i += 4) {
          tAlphaPixel = tPixels[i + tAlphaIndex];

          if (tAlphaPixel === 0) continue;

          if (tAlphaPixel === 255) {
            tPixels[i] = (tPixels[i] * pMultiplier + pAdd) | 0;
            tPixels[i + pIndex2] = (tPixels[i + pIndex2] * pMultiplier2 + pAdd2) | 0;
          } else {
            tAlphaRatio = tAlphaPixel / 255;
            tAlphaInverter = 1 + (1 - tAlphaRatio);
            
            tPixels[i] = (tPixels[i] * tAlphaInverter * pMultiplier * tAlphaRatio + pAdd * tAlphaRatio) | 0;
            tPixels[i + pIndex2] = (tPixels[i + pIndex2] * tAlphaInverter * pMultiplier2 * tAlphaRatio + pAdd2 * tAlphaRatio) | 0;
          }
        }
      } else {
        for (var i = pIndex, il = tPixels.length; i < il; i += 4) {
          if (tPixels[i + tAlphaIndex] === 0) continue;

          tPixels[i] = (tPixels[i] * pMultiplier + pAdd) | 0;
          tPixels[i + pIndex2] = (tPixels[i + pIndex2] * pMultiplier2 + pAdd2) | 0;
        }
      }
    }

    if (tAlphaAdd !== 0) {
      doAll();
      tTargetContext.putImageData(tAllPixelsImageData, tTargetX, tTargetY);
    } else {
      var tSetBytes = true;

      if (tHavePositiveMultipliers && (tRedMultiplier + tGreenMultiplier + tBlueMultiplier === 0)) {
        tSetBytes = doSetAll();
      } else if (tHavePositiveMultipliers && tHaveSameMultipliers && !tHasAdds) {
        tSetBytes = doDarkenAll();
      } else if (tHavePositiveMultipliers && tHasAdds && tHavePositiveAdds && tHaveSameMultipliers) {
        tSetBytes = doDarkenAllLighten();
      } else if (tHasAdds && tHavePositiveAdds && !tHaveMultipliers) {
        tSetBytes = doLightenAll();
      } else if (canMultiply() && tHavePositiveMultipliers && (!tHasAdds || (tHasAdds && tHavePositiveAdds))) {
        if (!tHasAdds) {
          tSetBytes = doDarken();
        } else {
          tSetBytes = doDarkenLighten();
        }
      } else if (tHasRed && tHasGreen && tHasBlue) {
        doThree();
      } else if (tHasRed && tHasGreen) {
        doTwoIndex(0, tRedMultiplier, tRedAdd, 1, tGreenMultiplier, tGreenAdd);
      } else if (tHasRed && tHasBlue) {
        doTwoIndex(0, tRedMultiplier, tRedAdd, 2, tBlueMultiplier, tBlueAdd);
      } else if (tHasGreen && tHasBlue) {
        doTwoIndex(1, tGreenMultiplier, tGreenAdd, 2, tBlueMultiplier, tBlueAdd);
      } else if (tHasRed) {
        doOneIndex(0, tRedMultiplier, tRedAdd);
      } else if (tHasGreen) {
        doOneIndex(1, tGreenMultiplier, tGreenAdd);
      } else if (tHasBlue) {
        doOneIndex(2, tBlueMultiplier, tBlueAdd);
      }

      if (tSetBytes) {
        tTargetContext.putImageData(tAllPixelsImageData, tTargetX, tTargetY);
      }
    }
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.impl.web.graphics.shader.fragment.ColorShader = {
    pre: function(pShader, pSurface, pProgram) {
      pProgram.colors.push(pShader.getColor().clone());
    },

    style: function(pShader, pSurface, pProgram) {
      pSurface.context[pProgram.fillTypeText] = pProgram.colors[0].toCSSString();

      return false;
    },

    post: function(pShader, pSurface, pProgram) {}
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.impl.web.graphics.shader.fragment.AlphaShader = {
    pre: function(pShader, pSurface, pProgram) {
      var tContext = pSurface.context;
      var tAlpha = pShader.getGlobalAlpha();
      var tOldAlpha = pShader.oldAlpha = tContext.globalAlpha;

      if (tOldAlpha !== tAlpha) {
        tContext.globalAlpha = tAlpha < 0 ? 0 : tAlpha;
      }
    },

    post: function(pShader, pSurface, pProgram) {
      var tCurrentAlpha = pSurface.context.globalAlpha;
      var tOldAlpha = pShader.oldAlpha;

      if (tCurrentAlpha !== tOldAlpha) {
        pSurface.context.globalAlpha = tOldAlpha;        
      }
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.impl.web.graphics.draw = {};

/**
 * @author Guangyao Liu
 *
 * Copyright (C) 2014 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var GradientStyle = global.benri.graphics.draw.GradientStyle;

  var mLinearGradientMap = {};
  var mRadialGradientMap = {};
  var mGradientStorageSize = 20;

  function CanvasGradientFactory() {
    
  }

  CanvasGradientFactory._currentSize = 0;
  
  CanvasGradientFactory.getInstance = function (pGradientStyle, pContext, pColors) {
    var tGradient;
    var tGradientMap;
    var tColorSignature = '$';
    var tCompleteSignature;

    if (pGradientStyle.type === GradientStyle.TYPE_RADIAL) {
      tGradientMap = mRadialGradientMap;
    } else if (pGradientStyle.type === GradientStyle.TYPE_LINEAR) {
      tGradientMap = mLinearGradientMap;
    }

    for (var i = 0, il = pColors.length; i < il; i++) {
      tColorSignature += pColors[i].toCSSString();
    }

    tCompleteSignature = pGradientStyle.signature + tColorSignature;

    tGradient = tGradientMap[tCompleteSignature];
    if (tGradient !== void 0) {
      return tGradient;
    }

    tGradient = _createCanvasGradient(pGradientStyle, pContext, pColors);

    if (tGradient !== null && CanvasGradientFactory._currentSize < mGradientStorageSize) {
      tGradientMap[tCompleteSignature] = tGradient;
      CanvasGradientFactory._currentSize++;
    }
      
    return tGradient;
  };

  function _createCanvasGradient(pGradientStyle, pContext, pColors) {
    var tGradient;
    var tStartPoint = pGradientStyle.startPoint;
    var tEndPoint = pGradientStyle.endPoint;
    var tStartRadius;
    var tEndRadius;
    var tColorRatioStops = pGradientStyle.colorRatioStops;
    var tStopColors = pColors;
    var i, il;

    if (tStartPoint === null || tEndPoint === null) {
      return null;
    }

    if (pGradientStyle.type === GradientStyle.TYPE_RADIAL) {
      tStartRadius = pGradientStyle.startRadius;
      tEndRadius = pGradientStyle.endRadius;

      tGradient = pContext.createRadialGradient(
        tStartPoint.x, tStartPoint.y, tStartRadius, tEndPoint.x, tEndPoint.y, tEndRadius
      );
    } else if (pGradientStyle.type === GradientStyle.TYPE_LINEAR) {
      tGradient = pContext.createLinearGradient(
        tStartPoint.x, tStartPoint.y, tEndPoint.x, tEndPoint.y
      );
    }

    for (i = 0, il = tColorRatioStops.length; i < il; i++) {
      tGradient.addColorStop(tColorRatioStops[i], tStopColors[i].toCSSString());
    }
    
    return tGradient;
  }

  global.benri.impl.web.graphics.draw.CanvasGradientFactory = CanvasGradientFactory;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var CanvasGradientFactory = benri.impl.web.graphics.draw.CanvasGradientFactory;

  benri.impl.web.graphics.shader.fragment.RadialGradientShader = {
    pre: function(pShader, pSurface, pProgram) {
      var tGradientStyle = pShader.getGradientStyle();
      var tColors;
      var tStopColors;

      if (tGradientStyle !== null) {
        tColors = pProgram.colors;
        tStopColors = tGradientStyle.stopColors;
        for (var i = 0, il = tStopColors.length; i < il; i++) {
          tColors.push(tStopColors[i].clone());
        }
      }
    },

    style: function(pShader, pSurface, pProgram) {
      var tContext = pSurface.context;
      var tGradientStyle = pShader.getGradientStyle();
      var tMatrix = pShader.getMatrix();
      var tFillTypeText = pProgram.fillTypeText;
      var tWorldMatrix = pProgram.matrix;
      var i, il;

      pSurface.saveContext();
      pSurface.setIdentityTransform();

      tContext[tFillTypeText] = CanvasGradientFactory.getInstance(tGradientStyle, tContext, pProgram.colors);
      pSurface.setTransform(
        tWorldMatrix.a,
        tWorldMatrix.b,
        tWorldMatrix.c,
        tWorldMatrix.d,
        tWorldMatrix.e,
        tWorldMatrix.f
      );
      pSurface.transform(tMatrix.a, tMatrix.b, tMatrix.c, tMatrix.d, tMatrix.e, tMatrix.f);

      return false;
    },

    post: function(pShader, pSurface, pProgram) {
      pSurface.restoreContext();
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var CanvasGradientFactory = benri.impl.web.graphics.draw.CanvasGradientFactory;

  benri.impl.web.graphics.shader.fragment.LinearGradientShader = {
    pre: function(pShader, pSurface, pProgram) {
      var tGradientStyle = pShader.getGradientStyle();
      var tColors;
      var tStopColors;

      if (tGradientStyle !== null) {
        tColors = pProgram.colors;
        tStopColors = tGradientStyle.stopColors;
        for (var i = 0, il = tStopColors.length; i < il; i++) {
          tColors.push(tStopColors[i].clone());
        }
      }
    },

    style: function(pShader, pSurface, pProgram) {
      var tContext = pSurface.context;
      var tGradientStyle = pShader.getGradientStyle();
      var tMatrix = pShader.getMatrix();
      var tFillTypeText = pProgram.fillTypeText;
      var tWorldMatrix = pProgram.matrix;
      var i, il;

      pSurface.saveContext();
      pSurface.setIdentityTransform();

      tContext[tFillTypeText] = CanvasGradientFactory.getInstance(tGradientStyle, tContext, pProgram.colors);
      pSurface.setTransform(
        tWorldMatrix.a,
        tWorldMatrix.b,
        tWorldMatrix.c,
        tWorldMatrix.d,
        tWorldMatrix.e,
        tWorldMatrix.f
      );
      pSurface.transform(tMatrix.a, tMatrix.b, tMatrix.c, tMatrix.d, tMatrix.e, tMatrix.f);

      return false;
    },

    post: function(pShader, pSurface, pProgram) {
      pSurface.restoreContext();
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.content = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  benri.content.MimeType = MimeType;

  function MimeType(pString) {
    var tType = '';
    var tSubType = '';
    var i, il;
    var tChar;
    var tParameters = {};
    var tParamName = '';
    var tParamValue = '';

    var STATE_TYPE = 1;
    var STATE_SUBTYPE = 2;
    var STATE_PARAMNAME = 3;
    var STATE_PARAMVALUE = 4;

    var tState = STATE_TYPE;

    for (i = 0, il = pString.length; i < il; i++) {
      tChar = pString[i];

      switch (tState) {
        case STATE_TYPE:
          if (tChar === '/') {
            tState = STATE_SUBTYPE;
          } else if (tChar !== ' ') {
            tType += tChar;
          }

          break;
        case STATE_SUBTYPE:
          if (tChar !== ' ') {
            tSubType += tChar;
          } else if (tChar === ';') {
            tState = STATE_PARAMNAME;
          }

          break;
        case STATE_PARAMNAME:
          if (tChar === '=') {
            tState = STATE_PARAMVALUE;
          } else if (tChar === ';') {
            if (tParamName !== '') {
              tParameters[tParamName] = '';
              tParamName = '';
            }
          } else if (tChar !== ' ') {
            tParamName += tChar;
          }

          break;
        case STATE_PARAMVALUE:
          if (tChar === ';') {
            tParameters[tParamName] = tParamValue;
            tParamName = tParamValue = '';
            tState = STATE_PARAMNAME;
          } else if (tChar !== ' ') {
            tParamValue += tChar;
          }

          break;
      }
    }

    if (tParamName !== '') {
      tParameters[tParamName] = tParamValue;
    }

    this.type = tType;
    this.subtype = tSubType;
    this.params = tParameters;

    this.toString = toString;
  }

  function toString(pIncludeParams) {
    var tBase = this.type + '/' + this.subtype;
    var tParams;
    var k;

    if (pIncludeParams === void 0 || pIncludeParams === true) {
      tParams = this.params;

      for (k in tParams) {
        tBase += ('; ' + k + '=' + tParams[k]);
      }
    }

    return tBase;
  }

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

benri.concurrent = {};
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  var PersistentEventEmitter = benri.event.PersistentEventEmitter;

  benri.concurrent.Delay = Delay;

  function Delay() {
    PersistentEventEmitter(this);
  }

  var tProto = Delay.prototype;

  tProto.resolve = function(pValue) {
    this.resetEvent('progress');
    this.resetEvent('reject');

    this.emit('resolve', pValue);

    return this;
  };

  tProto.reject = function(pReason) {
    this.resetEvent('resolve');
    this.resetEvent('progress');

    this.emit('reject', pReason);

    return this;
  };

  tProto.progress = function(pData) {
    this.emit('progress', pData);

    return this;
  };

  tProto.as = function(pCallback) {
    this.on('progress', pCallback);

    return this;
  };

  tProto.then = function(pSuccess, pReject) {
    if (pSuccess) {
      this.onFor('resolve', pSuccess, 1);
    }

    if (pReject) {
      this.onFor('reject', pReject, 1);
    }

    return this;
  };

  tProto.catch = function(pReject) {
    this.onFor('reject', pReject, 1);

    return this;
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var net = benri.net;
  var impl = benri.impl;
  var Delay = benri.concurrent.Delay;
  var URL = net.URL;

  net.Request = Request;

  var RequestImpl;

  function Request(pURL, pMethod, pRaw) {
    if (RequestImpl === void 0) {
      RequestImpl = impl.get('net.Request').best;
    }

    if (!(pURL instanceof URL)) {
      pURL = new URL(pURL);
    }

    this.url = pURL;
    this.method = (pMethod || 'GET').toUpperCase();
    this._headers = [];
    this.timeout = 0;
    this._sending = false;
    this.isRaw = pRaw || false;

    this._impl = new RequestImpl(this);
  }

  var tProto = Request.prototype;

  tProto.setHeader = function(pName, pValue) {
    if (this._sending) {
      throw new Error('Invalid state');
    }

    this._headers[pName] = pValue;
  };

  tProto.getHeader = function(pName) {
    return this._headers[pName] || null;
  };

  tProto.getAllHeaders = function() {
    var tHeaders = this._headers;
    var tResult = {};

    for (var k in tHeaders) {
      tResult[k] = tHeaders[k];
    }

    return tResult;
  };

  tProto.send = function(pData) {
    if (this._sending) {
      throw new Error('Invalid state');
    }

    var tDelay = new Delay();

    this._sending = true;

    var tImpl = this._impl;

    tImpl.on('progress', function(pEvent) {
      tDelay.progress({
        current: pEvent.current,
        total: pEvent.total
      });
    });

    tImpl.on('error', function(pEvent) {
      tDelay.reject({
        type: pEvent.type,
        status: pEvent.status,
        message: pEvent.message
      });
    });

    tImpl.on('load', function(pEvent) {
      tDelay.resolve(pEvent.response);
    });

    tImpl.send(pData);

    return tDelay;
  };

  tProto.abort = function() {
    if (this._sending) {
      this._sending = false;
      this._impl.abort();
    }
  };

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  var implGet = benri.impl.get;
  var implAdd = benri.impl.add;
  var MimeType = benri.content.MimeType;
  var Keeper = benri.mem.Keeper;
  var Delay = benri.concurrent.Delay;

  benri.content.Blob = Blob;

  function Blob(pType) {
    Keeper(this);

    this.type = pType || new MimeType('application/octet-stream');
  };

  var tProto = Blob.prototype;

  tProto.setBuffer = function(pBuffer) {
    this._buffer = pBuffer;
  };

  tProto.getBuffer = function() {
    return this._buffer;
  };

  Blob.fromBuffer = function(pBuffer, pType) {
    var tMimeType = typeof pType === 'string' ? new MimeType(pType) : pType;
    var tBlob;
    var tClazz = getBlobClass(tMimeType);

    if (tClazz === Blob) {
      tBlob = new Blob(tMimeType);
      tBlob._buffer = pBuffer;

      return (new Delay()).resolve(tBlob);
    }

    return tClazz.fromBuffer(pBuffer, tMimeType);
  };

  Blob.getClass = function(pType) {
    var tMimeType = typeof pType === 'string' ? new MimeType(pType) : pType;

    return getBlobClass(tMimeType);
  };

  Blob.getClasses = function(pType) {
    var tMimeType = typeof pType === 'string' ? new MimeType(pType) : pType;

    var tImpl = implGet('content.blob.' + tMimeType.toString(false), {
      type: tMimeType
    });

    if (tImpl === null) {
      tImpl = implGet('content.blob.' + tMimeType.type + '/*', {
        type: tMimeType
      });

      if (tImpl === null) {
        return {
          best: Blob,
          bestScore: 1,
          list: [{clazz: Blob, score: 1}]
        };
      }
    }

    return tImpl;
  };

  function getBlobClass(pType) {
    var tImpl = implGet('content.blob.' + pType.toString(false), {
      type: pType
    });

    if (tImpl === null) {
      tImpl = implGet('content.blob.' + pType.type + '/*', {
        type: pType
      });

      if (tImpl === null) {
        return Blob;
      }
    }

    return tImpl.best;
  }

  Blob.register = function(pTypes, pCallback) {
    if (typeof pTypes === 'string') {
      implAdd('content.blob.' + pTypes, pCallback);
    } else {
      for (var i = 0, il = pTypes.length; i < il; i++) {
        implAdd('content.blob.' + pTypes[i], pCallback);
      }
    }
  };

}());
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  /**
   * @class
   * @extends {benri.content.Blob}
   */
  var SWF = (function(pSuper) {
    var Delay = benri.concurrent.Delay;

    /**
     * The data structure that holds all data
     * about an SWF file.
     * @constructor
     * @class {quickswf.SWF}
     */
    function SWF() {
      pSuper.call(this, 'application/x-shockwave-flash');

      this.version = 1;
      this.fileSize = 0;
      this.encoding = 'ascii';
      this.bounds = null;
      this.width = 0;
      this.height = 0;
      this.frameRate = 1;
      this.frameCount = 0;
      this.rootSprite = new quickswf.structs.Sprite();
      this.dictionary = {};
      this.orderedDictionary = [];
      this.fonts = {};
      this.jpegTableDQT = null;
      this.jpegTableDHT = null;
      this.streamSoundMetadata = null;
      this.assetManifest = new benri.content.Manifest();

      this.on('destroy', onDestroy);
    }
  
    var tProto = SWF.prototype = Object.create(pSuper.prototype);
    tProto.constructor = SWF;
  
    function onDestroy(pData, pTarget) {
      pTarget._buffer = null;
      pTarget.bounds = null;
      pTarget.rootSprite = null;
      pTarget.jpegTableDQT = null;
      pTarget.jpegTableDHT = null;
      pTarget.dictionary = null;
      pTarget.orderedDictionary = null;
      pTarget.fonts = null;
      pTarget.streamSoundMetadata = null;
      pTarget.assetManifest.destroy();
      pTarget.assetManifest = null;
    };

    SWF.fromBuffer = function(pBuffer, pType) {
      var tDelay = new Delay();

      var tSWF = new SWF();

      tSWF.setBuffer(pBuffer);

      var tParser = new quickswf.Parser(tSWF);

      tParser.on('load', function(pSWF) {
        tDelay.resolve(pSWF);
      });

      tParser.on('error', function(pReason) {
        tDelay.reject(pReason);
      });

      tParser.addBuffer(pBuffer);

      return tDelay;
    };

    return SWF;
  })(benri.content.Blob);

  quickswf.SWF = SWF;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  quickswf.Parser = Parser;

  var mLogger = quickswf.logger;

  var RECT = quickswf.structs.RECT;
  var SWF = quickswf.SWF;
  var SWFReader = quickswf.SWFReader;

  var STATE_HEADER = 1; // Parsing the header
  var STATE_OUTTAG = 2; // Inbetween tags
  var STATE_INTAG = 3; // Inside a tag. Not used yet
  var STATE_ASSETS = 4; // Waiting for assets to load

  /**
   * @constructor
   */
  function Parser(pSWF) {
    benri.event.EventEmitter(this);

    /**
     * The SWFReader object for this parser.
     * @type {quickswf.SWFReader}
     */
    this.r = null;

    this.readers = [];

    /**
     * The SWF object that gets created after parsing.
     * @type {quickswf.SWF}
     */
    this.swf = pSWF;

    this.state = STATE_HEADER;

    this.encoding = 'ascii';

    /**
     * The currently being parsed frame index.
     * @type {Number}
     */
    this.currentFrame = 0;

    /**
     * A stack of frame indices to keep track of while parsing.
     * @type {Array.<Number>}
     */
    this.frameStack = new Array();

    /**
     * A stack of Sprites to keep track of while parsing.
     * @type {Array.<quickswf.structs.Sprite>}
     */
    this.spriteStack = new Array();

    /**
     * The currently being parsed Sprite.
     * @type {quickswf.structs.Sprite}
     */
    this.currentSprite = null;

    this.register = register;
  }

  function register(pId, pObject) {
    this.swf.dictionary[pId] = pObject;
    this.swf.orderedDictionary.push(pObject);
  }

  var tProto = Parser.prototype;

  /**
   * Adds a new action to the current frame
   * of the current sprite.
   * @param {Object} pData The data. Make sure it has a type property of type String.
   */
  tProto.add = function(pData) {
    var tFrames = this.currentSprite.frames;
    var tIndex = this.currentFrame;
    var tRealData = new Object();

    for (var k in pData) {
      tRealData[k] = pData[k];
    }

    if (tFrames[tIndex] === void 0) {
      tFrames[tIndex] = [tRealData];
    } else {
      tFrames[tIndex].push(tRealData);
    }
  };

  tProto.addBuffer = function(pBuffer) {
    var tReaders = this.readers;
    tReaders.push(new SWFReader(pBuffer));

    if (tReaders.length === 1) {
      this.parse();
    }
  }

  tProto.parseHeader = function(pReader) {
    var tSWF = this.swf;
    var tCompressedFlag = pReader.getChar();

    if (
        (tCompressedFlag !== 'C' && tCompressedFlag !== 'F' && tCompressedFlag !== 'Z') ||
        (pReader.getString(2) !== 'WS')
      ) {

      mLogger.error('Invalid SWF format');
      this.emit('error', 'Invalid SWF format');

      return null;
    }

    var tVersion = tSWF.version = pReader.getUint8();
    var tFileSize = tSWF.fileSize = pReader.getUint32();
    var tEncoding = 'utf-8';

    if (tVersion <= 5) {
      tEncoding = 'shift_jis';
    }

    this.encoding = tSWF.encoding = pReader.encoding = tEncoding;

    if (tCompressedFlag === 'C') {
      var tInflator = new benri.io.compression.Inflator('inflate');
      pReader = this.r = new quickswf.SWFReader(tInflator.inflate(pReader.getCopyTo(tFileSize)));
      tSWF.fileSize -= 8; // offset for beginning of file which doesn't exist in this new buffer.
    } else if (tCompressedFlag === 'Z') {
      // LZMA compression.
      mLogger.error('LZMA compression is not supported');
      this.emit('error', 'LZMA compression is not supported');

      return null;
    }

    var tBounds = tSWF.bounds = RECT.load(pReader);

    tSWF.width = Math.abs((tBounds.right - tBounds.left) / 20);
    tSWF.height = Math.abs((tBounds.bottom - tBounds.top) / 20);

    tSWF.frameRate = pReader.getUint16() / 256;
    var tFrameCount = tSWF.frameCount = pReader.getUint16();

    this.currentSprite = tSWF.rootSprite;
    this.currentSprite.id = 0;
    this.currentSprite.frameCount = tFrameCount;

    this.state = STATE_OUTTAG;

    return pReader;
  };

  tProto.parseTag = function(pReader) {
    var tTypeAndLength;
    var tType;
    var tLength;
    var tExpectedFinalIndex;
    var tFileSize = this.swf.fileSize;

    tTypeAndLength = pReader.getUint16();
    tType = (tTypeAndLength >>> 6) + '';
    tLength = tTypeAndLength & 0x3F;

    if (tLength === 0x3F) {
      tLength = pReader.getUint32();
    }

    tExpectedFinalIndex = pReader.tell() + tLength;

    if (!(tType in this)) {
      mLogger.warn('Unknown tag: ' + tType);
      pReader.seek(tLength);
    } else {
      this[tType](tLength);

      // Forgive the hack for DefineSprite (39). It's length is for all the tags inside of it.
      if (tType !== '39' && pReader.tell() !== tExpectedFinalIndex) {
        mLogger.warn('Expected final index incorrect for tag ' + tType);
        pReader.seekTo(tExpectedFinalIndex);
      }
    }
  }

  /**
   * Parses the buffer.
   */
  tProto.parse = function() {
    var tTimer = Date.now();
    var tReader = this.r = this.readers.pop();
    var tState = this.state;
    var tIndex;
    var tFileSize = this.swf.fileSize;
    var tAssetManifest = this.swf.assetManifest;

    tReader.encoding = this.encoding;

    while (true) {
      if (tState === STATE_OUTTAG) {
        this.parseTag(tReader);
      } else if (tState === STATE_HEADER) {
        if ((tReader = this.parseHeader(tReader)) === null) {
          return;
        }

        tFileSize = this.swf.fileSize;
      } else {
        break;
      }

      if (tReader.tell() >= tFileSize) {
        this.state = STATE_ASSETS;
        tAssetManifest.load();
        tAssetManifest.onLoad(createAssetLoadWrapper(this));

        return;
      }

      if (Date.now() - tTimer >= 4500) {
        this.readers.splice(0, 0, tReader);
        setTimeout(createTimeoutWrapper(this), 10);

        return;
      }

      tState = this.state;
    }
  };

  function createAssetLoadWrapper(pParser) {
    return function() {
      pParser.emit('load', pParser.swf);
    }
  }

  function createTimeoutWrapper(pParser) {
    return function() {
      pParser.parse();
    }
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['39'] = defineSprite;
  global.quickswf.structs.Sprite = Sprite;

  /**
   * @constructor
   * @class {quickswf.structs.Sprite}
   */
  function Sprite() {
    this.id = -1;
    this.frameCount = 0;
    this.frames = new Array(0);
    this.frameLabels = new Object();
  }

  Sprite.prototype.displayListType = 'DefineSprite';

  /**
   * Loads a Sprite.
   * @param {quickswf.Reader} pReader The reader to read from.
   * @return {quickswf.structs.Sprite} The parsed Sprite.
   */
  Sprite.load = function(pReader) {
    var tSprite = new Sprite();
    tSprite.id = pReader.getUint16();
    tSprite.frameCount = pReader.getUint16();

    return tSprite;
  };

  function defineSprite(pLength) {
    var tSprite = Sprite.load(this.r);
    this.spriteStack.push(this.currentSprite);
    this.currentSprite = tSprite;
    this.frameStack.push(this.currentFrame);
    this.currentFrame = 0;

    this.register(tSprite.id, tSprite);
  }

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 QuickSWF project
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  quickswf.Parser.prototype['14'] = defineSound;
  quickswf.Parser.prototype['15'] = startSound;
  quickswf.Parser.prototype['18'] = soundStreamHead;
  quickswf.Parser.prototype['45'] = soundStreamHead;
  quickswf.Parser.prototype['19'] = soundStreamBlock;

  /**
   * @constructor
   * @class {quickswf.structs.EventSound}
   */
  function EventSound(pFmt, pFs, pDepth, pCh, pLen, pData) {
    this.soundFormat = pFmt; // Coding format ('0'=PCM, '1'=ADPCM, '2'=MP3, '3'=PCM(LSB first))
    this.soundRate = pFs; // Sampling rate ('0'=5.5kHz, '1'=11kHz, '2'=22kHz, '3'=44kHz)
    this.soundSize = pDepth; // Bit depth ('0'=8bit, '1'=16bit)
    this.soundType = pCh; // Number of channels ('0'=mono, '1'=stereo)
    this.soundSampleCount = pLen; // Number of samples (for stereo, number of sample pairs)
    this.soundData = pData; // Byte array
  }

  /**
   * Loads a EventSound type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {quickswf.Reader} pBounds Start of the next tag.
   * @return {quickswf.structs.EventSound} The loaded EventSound.
   */
  EventSound.load = function(pReader, pBounds) {
    var tFmt = pReader.getUBits(4);
    var tFs = pReader.getUBits(2);
    var tDepth = pReader.getUBits(1);
    var tCh = pReader.getUBits(1);
    var tLen = pReader.getUint32();
    var tMetaData = new SoundMetadata(tFmt, tFs, tDepth, tCh, tLen, 0);
    var tData = SoundData.load(pReader, tMetaData, pBounds);

    return new EventSound(tFmt, tFs, tDepth, tCh, tLen, tData);
  };


  /**
   * @constructor
   * @class {quickswf.structs.SoundData}
   */
  function SoundData(pData, pRaw, pType) {
    this.raw = pRaw;
    for (var k in pData) {
      if (pData[k] !== pRaw) {
        this[k] = pData[k];
      }
    }
    this.mimeType = pType;
  }

  /**
   * Loads a SoundData type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {quickswf.Reader} pBounds Start of the next tag.
   * @return {quickswf.structs.EventSound} The loaded SoundData.
   */
  SoundData.load = function(pReader, pMeta, pBounds) {
    var tFmt = pMeta.soundCompression,
        tData, tLength, tOffset, tRaw, tType;

    if (tFmt === 0 || tFmt === 3) {
quickswf.logger.debug('+++ PCM');
      // PCM
      tOffset = pReader.tell();
      tLength = pBounds - tOffset;
      tData = pReader.getCopy(tLength);
      /*
       * Need some conversion:
       *  - Number of channels:
       *        flag ('0'=mono, '1'=stereo)
       *                => Number (channel num)
       *  - Sampling rate:
       *        flag ('0'=5.5kHz, '1'=11kHz, '2'=22kHz, '3'=44kHz)
       *                => Number (Hz)
       *  - Bit depth:
       *        flag ('0'=8bits, '1'=16bits)
       *                => Number (bits/sample)
       */
      tRaw = createRIFFChunk(1/*PCM*/, pMeta.soundType + 1, 5500 << pMeta.soundRate,
              (pMeta.soundSize + 1) * 8, tData, tLength);
      tType = 'audio/wave';
      tData = {};
      tData.offset = 0;
    } else if (tFmt === 1) {
quickswf.logger.debug('+++ ADPCM');
      // ADPCM
      tData = {};
      tData.adpcmCodeSize = pReader.getUBits(2);
      tOffset = pReader.tell();
      tLength = pBounds - tOffset;
      tData.adpcmPackets = pReader.getCopy(tLength);
      /*
       *  - Bit depth:
       *        flag ('0'=2bits, '1'=3bits, '2'=4bits, '3'=5bits/sample)
       *                => Number (bits/sample)
       */
      tRaw = createRIFFChunk(2/*ADPCM*/, pMeta.soundType + 1, 5500 << pMeta.soundRate,
              tData.adpcmCodeSize + 2, tData.adpcmPackets, tLength);
      tData.offset = 0;
      tType = 'audio/x-wav';
    } else if (tFmt === 2) {
quickswf.logger.debug('+++ MP3');
      // MP3
      tData = {};
      tData.seekSamples = pReader.getInt16();
      tOffset = pReader.tell();
      tRaw = tData.mp3Frames = pReader.getCopyTo(pBounds);
      tData.offset = tOffset;
      tType = 'audio/mpeg';
    }

    pReader.seekTo(pBounds);

    return new SoundData(tData, tRaw, tType);
  };

  /**
   * Wraps up the PCM data in RIFF chunk (i.e. WAVE file.)
   * @param {Number}  pFmt Format type (PCM=1, ADPCM=2)
   * @param {Number}  pCh Number of channels.
   * @param {Number}  pFs Sampling rate (n samples per sec.)
   * @param {Number}  pDepth Length of a single sample in bits.
   * @param {Uint8Array}  pData Sound data.
   * @param {Number}  pLength Length of the sound data in bytes.
   * @return {Uint8Array} RIFF chunk (i.e. WAVE file.)
   */
  function createRIFFChunk(pFmt, pCh, pFs, pDepth, pData, pLength) {
    var Buffer = benri.io.Buffer,
        tRIFF = Buffer.create(44 + pLength),
        tBuffer = tRIFF.data,
        tCurr = 0, tIntBuf = Buffer.create(4),
        tBlockSize = pDepth / 8 * pCh,
        tBytesPerSec = tBlockSize * pFs,
        appendChars = function (pStr) {
            for (var i = 0, il = pStr.length; i < il; i++) {
              tBuffer[tCurr++] = pStr.charCodeAt(i);
            }},
        appendInt32 = function (pInt) {
            tIntBuf.setInt32(0, pInt, true);

            for (var i = 0; i < 4; i++) {
              tBuffer[tCurr++] = tIntBuf.getInt8(i);
            }},
        appendInt16 = function (pInt) {
            tIntBuf.setInt16(0, pInt, true);

            for (var i = 0; i < 2; i++) {
              tBuffer[tCurr++] = tIntBuf.getInt8(i);
            }};

    // RIFF chunk
    appendChars('RIFF');
    appendInt32(36 + pLength); // total size
    appendChars('WAVE');
    // format chunk
    appendChars('fmt ');
    appendInt32(16); // chunk size
    appendInt16(pFmt); // wave format type (PCM=1)
    appendInt16(pCh);  // number of channels (mono=1, streo=2)
    appendInt32(pFs);  // samples per sec
    appendInt32(tBytesPerSec); // bytes per sec (block size * samples per sec)
    appendInt16(tBlockSize); // block size (bits per sample / 8 * number of channels)
    appendInt16(pDepth); // bits per sample (8bit or 16bit)
    // data chunk
    appendChars('data');
    appendInt32(pLength); // chunk size
    tRIFF.copyFrom(pData, 44);

    return tRIFF;
  }

  /**
   * @constructor
   * @class {quickswf.structs.SOUNDINFO}
   */
  function SOUNDINFO(pStop, pNoMul, pEnv, pLoop, pOut, pIn) {
    this.syncStop = pStop; // Stop the sound now.
    this.syncNoMultiple = pNoMul; // Don't start the sound if already playing.
    this.hasEnvelope = pEnv; // Has envelope info.
    this.hasLoops = pLoop; // Has loop info.
    this.hasOutPoint = pOut; // Has out-point info.
    this.hasInPoint = pIn; // Has in-point infor.
  }

  /**
   * Loads a SOUNDINFO type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.SOUNDINFO} The loaded SOUNDINFO.
   */
  SOUNDINFO.load = function(pReader) {
    pReader.getUBits(2); // Skip reserved bits
    var tStop = (pReader.getUBits(1) === 1);
    var tNoMul = (pReader.getUBits(1) === 1);
    var tEnv = (pReader.getUBits(1) === 1);
    var tLoop = (pReader.getUBits(1) === 1);
    var tOut = (pReader.getUBits(1) === 1);
    var tIn = (pReader.getUBits(1) === 1);
    var soundInfo = new SOUNDINFO(tStop, tNoMul, tEnv, tLoop, tOut, tIn);
    // Number of samples to skip at beginning of sound.
    tIn && (soundInfo.inPoint = pReader.getUint32());
    // Position in samples of last sample to play.
    tOut && (soundInfo.outPoint = pReader.getUint32());
    // Sound loop count.
    tLoop && (soundInfo.loopCount = pReader.getUint16());

    if (tEnv) { // disable this for now...
      // Sound Envelope point count.
      soundInfo.envPoints = pReader.getUint8();
      soundInfo.envelopeRecords = new Array(soundInfo.envPoints);

      for (var i = 0, il = soundInfo.envPoints; i < il; i++) {
        // Sound Envelope records.
        soundInfo.envelopeRecords[i] = {};
        soundInfo.envelopeRecords[i].pos44 = pReader.getUint32();
        soundInfo.envelopeRecords[i].leftLevel = pReader.getUint16();
        soundInfo.envelopeRecords[i].rightLevel = pReader.getUint16();
      }
    }

    return soundInfo;
  };

  /**
   * @constructor
   * @class {quickswf.structs.SoundStreamHead}
   */
  function SoundMetadata(pFmt, pFs, pDepth, pCh, pLen, pLatency) {
    this.soundCompression = pFmt; // Coding format ('0'=PCM, '1'=ADPCM, '2'=MP3, '3'=PCM(LSB first))
    this.soundRate = pFs; // Sampling rate ('0'=5.5kHz, '1'=11kHz, '2'=22kHz, '3'=44kHz)
    this.soundSize = pDepth; // Bit depth ('0'=8bit, '1'=16bit)
    this.soundType = pCh; // Number of channels ('0'=mono, '1'=stereo)
    this.soundSampleCount = pLen; // Number of samples (for stereo, number of sample pairs)
    this.latencySeek = pLatency; // The value here sould match MP3's SeekSamples field in the first SoundStreamBlock.
  }

  /**
   * Loads a SoundMetadata type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.EventSound} The loaded SoundMetadata.
   */
  SoundMetadata.load = function(pReader) {
    pReader.getUBits(4); // Skip reserved bits
    pReader.getUBits(4); // Skip advisory bits (PlaybackSoundXxx)
    var tFmt = pReader.getUBits(4);
    var tFs = pReader.getUBits(2);
    var tDepth = pReader.getUBits(1);
    var tCh = pReader.getUBits(1);
    var tLen = pReader.getUint16();
    var tLatency = (tFmt !== 2 ? void 0 : pReader.getInt16());

    return new SoundMetadata(tFmt, tFs, tDepth, tCh, tLen, tLatency);
  };

  function defineSound(pLength) {
    var tReader = this.r, tBounds = tReader.tell() + pLength;
    var tId = tReader.getUint16();
    var tSound = EventSound.load(tReader, tBounds);
    tSound.id = tId;
    var tObj = tSound.soundData;

    this.swf.assetManifest.addBuffer(tId + '', tObj.raw, tObj.mimeType);
  }

  function startSound(pLength) {
    var tReader = this.r;
    var tId = tReader.getUint16();
    var tSoundInfo = SOUNDINFO.load(tReader);

    this.add({
      type: 'startSound',
      soundId: tId,
      soundInfo: tSoundInfo
    });
  }

  function soundStreamHead(pLength) {
    var tReader = this.r;
    //this.swf.streamSoundMetadata = SoundStreamHead.load(tReader);
    tReader.seek(pLength);
  }

  function soundStreamBlock(pLength) {
    var tMetaData = this.swf.streamSoundMetadata;

    if (tMetaData) {
      var tFmt = tMetaData.soundCompression;
      var tReader = this.r, tBounds = tReader.tell() + pLength;
      var tSound, tSampleCount;

      if (tFmt === 2) {
        // MP3
        tSampleCount = pReader.getUint16();
      }
      tSound = SoundData.load(tReader, tMetaData, tBounds);
      tSound.sampleCount = tSampleCount;

      this.add({
        type: 'soundStreamBlock',
        soundData: tSound
      });
    } else {
      this.r.seek(pLength);
    }
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  quickswf.Parser.prototype['2'] = defineShape;
  quickswf.Parser.prototype['22'] = defineShape2;
  quickswf.Parser.prototype['32'] = defineShape3;

  var mStructs = quickswf.structs;
  mStructs.Shape = Shape;

  var RECT = mStructs.RECT;
  var FILLSTYLE = mStructs.FILLSTYLE;
  var LINESTYLE = mStructs.LINESTYLE;
  var SHAPERECORD = mStructs.SHAPERECORD;

  /**
   * @constructor
   * @class {quickswf.structs.Shape}
   */
  function Shape() {
    this.id = -1;
    this.bounds = null;
    this.fillStyles = new Array();
    this.lineStyles = new Array();
    this.numberOfFillBits = 0;
    this.numberOfLineBits = 0;
    this.records = new Array();
  }

  Shape.prototype.displayListType = 'DefineShape';

  /**
   * Loads a Shape type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithStyles True if styles need to parsed.
   * @param {bool} pWithAlpha True if alpha needs to be parsed.
   * @param {bool} pHasLargeFillCount True if this struct can have more than 256 styles.
   * @return {quickswf.structs.Shape} The loaded Shape.
   */
  Shape.load = function(pReader, pWithStyles, pWithAlpha, pHasLargeFillCount) {
    var tShape = new Shape();

    if (pWithStyles) {
      tShape.fillStyles = FILLSTYLE.loadMultiple(pReader, pWithAlpha, pHasLargeFillCount, false);
      tShape.lineStyles = LINESTYLE.loadMultiple(pReader, pWithAlpha, pHasLargeFillCount, false);
    } else {
      tShape.fillStyles = [new FILLSTYLE(false)];
      tShape.lineStyles = [new LINESTYLE(false)];
    }

    tShape.numberOfFillBits = pReader.getUBits(4);
    tShape.numberOfLineBits = pReader.getUBits(4);
    tShape.records = SHAPERECORD.loadMultiple(pReader, tShape, pWithAlpha);

    return tShape;
  };

  function defineShape(pLength) {
    parseShape(this, false, false);
  }

  function defineShape2(pLength) {
    parseShape(this, false, true);
  }

  function defineShape3(pLength) {
    parseShape(this, true, true);
  }


  function parseShape(pParser, pWithAlpha, pHasLargeFillCount) {
    var tReader = pParser.r;
    var tId = tReader.getUint16();
    var tBounds = RECT.load(tReader);
    var tShape = Shape.load(tReader, true, pWithAlpha, pHasLargeFillCount);

    tShape.id = tId;
    tShape.bounds = tBounds;

    pParser.register(tShape.id, tShape);
  }


}(this));

/**
 * @author Yoshihiro Yamazaki
 *
 * Copyright (C) 2012 QuickSWF project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['46'] = defineMorphShape;

  var mStructs = global.quickswf.structs;
  var RECT = mStructs.RECT;
  var FILLSTYLE = mStructs.FILLSTYLE;
  var LINESTYLE = mStructs.LINESTYLE;
  var SHAPERECORD = mStructs.SHAPERECORD;
  var STYLECHANGERECORD = mStructs.STYLECHANGERECORD;

  /**
   * @constructor
   * @class {quickswf.structs.MorphShape}
   */
  function MorphShape() {
    this.id = -1;
    this.startBounds = null;
    this.endBounds = null;
    this.fillStyles = new Array();
    this.lineStyles = new Array();
    this.numberOfFillBits = 0;
    this.numberOfLineBits = 0;
    this.startEdges = new Array();
    this.endEdges = new Array();
  }

  MorphShape.prototype.displayListType = 'DefineMorphShape';

  /**
   * Loads a MorphShape type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {number} pOffsetOfEndEdges Offset of EndEdges
   * @param {bool} pWithStyles True if styles need to parsed.
   * @return {quickswf.structs.MorphShape} The loaded MorphShape.
   */
  MorphShape.load = function(pReader, pOffsetOfEndEdges, pWithStyles) {
    var tMorphShape = new MorphShape();

    if (pWithStyles) {
      tMorphShape.fillStyles = FILLSTYLE.loadMultiple(pReader, true, true, true);
      tMorphShape.lineStyles = LINESTYLE.loadMultiple(pReader, true, true, true);
    }

    pReader.align();

    tMorphShape.numberOfFillBits = pReader.getUBits(4);
    tMorphShape.numberOfLineBits = pReader.getUBits(4);

    var tStartEdges = tMorphShape.startEdges = SHAPERECORD.loadMultiple(pReader, tMorphShape, true, true);

    pReader.seekTo(pOffsetOfEndEdges);

    tMorphShape.numberOfFillBits = pReader.getUBits(4);
    tMorphShape.numberOfLineBits = pReader.getUBits(4);

    var tEndEdges = tMorphShape.endEdges = SHAPERECORD.loadMultiple(pReader, tMorphShape, true, true);

    return tMorphShape;
  };

  function defineMorphShape(pLength) {
    parseMorphShape(this);
  }


  function parseMorphShape(pParser) {
    var tReader = pParser.r;
    var tId = tReader.getUint16();
    var tStartBounds = RECT.load(tReader);
    var tEndBounds = RECT.load(tReader);
    var tOffset = tReader.getUint32();
    var tOffsetOfOffset = tReader.tell();

    var tMorphShape = MorphShape.load(tReader, tOffsetOfOffset + tOffset, true, true);
    tMorphShape.id = tId;
    tMorphShape.startBounds = tStartBounds;
    tMorphShape.endBounds = tEndBounds;

    pParser.register(tId, tMorphShape);
  }

}(this));

/**
 * @author Yoshihiro Yamazaki
 *
 * Copyright (C) 2012 QuickSWF project
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  quickswf.Parser.prototype['11'] = defineText;
  quickswf.Parser.prototype['33'] = defineText2;

  var RECT = quickswf.structs.RECT;
  var MATRIX = quickswf.structs.MATRIX;
  var RGBA = quickswf.structs.RGBA;
  var TEXTRECORD = quickswf.structs.TEXTRECORD;

  /**
   * @constructor
   * @extends {Array}
   * @class {quickswf.structs.Text}
   */
  function Text() {
    this.fontID = -1;
    this.textColor = new RGBA(255, 255, 255, 1);
    this.xOffset = 0;
    this.yOffset = 0;
    this.textHeight = 240;
    this.xAdvance = 0;
    this.textrecords = null;
  }

  Text.prototype.displayListType = 'DefineText';

  /**
   * Loads a Text type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @param {bool} pWithAlpha True if parsing alpha is needed.
   * @return {quickswf.structs.Text} The loaded Text.
   */
  Text.load = function(pReader, pWithAlpha) {
    var tGlyphBits = pReader.getUint8();
    var tAdvanceBits = pReader.getUint8();
    var tText = new Text();
    var tTextRecord_1stB;
    var tTextRecords = new Array(0);

    while ((tTextRecord_1stB = pReader.getUint8()) !== 0) {
        var tTextRecord = TEXTRECORD.load(pReader, tTextRecord_1stB, pWithAlpha, tGlyphBits, tAdvanceBits, tText);
        tTextRecords.push(tTextRecord);
    }

    tText.textrecords = tTextRecords;

    return tText;
  };

  function defineText(pLength) {
    parseText(this, false);
  }

  function defineText2(pLength) {
    parseText(this, true);
  }

  function parseText(pParser, withAlpha) {
    var tReader = pParser.r;
    var tId = tReader.getUint16();
    var tBounds = RECT.load(tReader);
    var tMatrix = MATRIX.load(tReader);
    var tText = Text.load(tReader, withAlpha);
    tText.id = tId;
    tText.bounds = tBounds;
    tText.matrix = tMatrix;

    pParser.register(tId, tText);
  }

}(this));

/**
 * @author Yoshihiro Yamazaki
 *
 * Copyright (C) 2012 Yoshihiro Yamazaki
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  quickswf.Parser.prototype['10'] = defineFont;
  quickswf.Parser.prototype['48'] = defineFont2;

  var RECT = quickswf.structs.RECT;
  var Shape = quickswf.structs.Shape;
  var KERNINGRECORD = quickswf.structs.KERNINGRECORD;;
  var Decoder = benri.text.Decoder;
  var Buffer = benri.io.Buffer;

  /**
   * @constructor
   * @extends {Array}
   * @class {quickswf.structs.Font}
   */
  function Font() {
    this.id = -1;
    this.shiftJIS = false;
    this.smalltext = false;
    this.ansi = false;
    this.italic = false;
    this.bold = false;
    this.langCode = 0;
    this.name = null;
    this.codeTable = null;
    this.ascent = 0;
    this.descent = 0;
    this.leading = 0;
    this.advanceTable = null;
    this.boundsTable = null;
    this.kerningTable = null;
    this.lookupTable = null;
    this.shapes = null;
  }

  /**
   * Loads a Font type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.Font} The loaded Font.
   */
  Font.load = function(pReader, pOffsetOfOffsetTable, pOffsetTable) {
    var tFont = new Font();
    if (pOffsetOfOffsetTable === null) {
      return tFont;
    }
    var tNumGlyphs = pOffsetTable.length;
    var tGlyphShapeTable = new Array(tNumGlyphs);
    for (var i = 0 ; i < tNumGlyphs ; i++) {
      pReader.seekTo(pOffsetOfOffsetTable + pOffsetTable[i]);
      var tShape = Shape.load(pReader, false, false, false);
      tGlyphShapeTable[i] = tShape;
    }
    tFont.shapes = tGlyphShapeTable;
    return tFont;
  };

  function defineFont(pLength) {
    parseFont(this);
  }

  function defineFont2(pLength) {
    parseFont2(this);
  }

  function parseFont(pParser) {
    var tReader = pParser.r;
    var tId = tReader.getUint16();
    var tOffsetOfOffsetTable = tReader.tell();
    var tOfOffsetTable_0 = tReader.getUint16();
    var tNumGlyphs = tOfOffsetTable_0 / 2;
    var tOffsetTable = new Array(tNumGlyphs);
    tOffsetTable[0] = tOfOffsetTable_0;

    for (var i = 1 ; i < tNumGlyphs ; i++) {
      tOffsetTable[i] = tReader.getUint16();
    }

    var tFont = Font.load(tReader, tOffsetOfOffsetTable, tOffsetTable);

    tFont.id = tId;

    pParser.swf.fonts[tId] = tFont;
  }

  function parseFont2(pParser) {
    var tReader = pParser.r;
    var tId = tReader.getUint16();
    var tFlags = tReader.getUint8();
    var tFontFlagsHasLayout   = (tFlags & 0x80) ? true : false;
    var tFontFlagsShiftJIS    = (tFlags & 0x40) ? true : false;
    var tFontFlagsSmallText   = (tFlags & 0x20) ? true : false;
    var tFontFlagsANSI        = (tFlags & 0x10) ? true : false;
    var tFontFlagsWideOffsets = (tFlags & 0x08) ? true : false;
    var tFontFlagsWideCodes   = (tFlags & 0x04) ? true : false;
    var tFontFlagsItalic      = (tFlags & 0x02) ? true : false;
    var tFontFlagsBold        = (tFlags & 0x01) ? true : false;
    var tLangCode = tReader.getUint8();
    var tFontNameLen = tReader.getUint8();
    var tFontName = (tFontNameLen > 0) ? tReader.getString(tFontNameLen) : null;
    var hasMultibyteChar = function(pStr) {
      for (var i = 0, il = pStr.length; i < il; i++) {
        if (pStr.charCodeAt(i) > 0x7F) {
          return true;
        }
      }
      return false;
    };

    if (hasMultibyteChar(tFontName) || tFontName.indexOf('_?') === 0) {
      // _????: Flash Pro generates this magical font name if Japanese font is used in English OS.

      // Font name with multibyte-string tends not to be supported.:
      // TODO: We need to find appropreate font family for Japanese chars.
      tFontName = 'Osaka';
    }

    var tNumGlyphs = tReader.getUint16();
    var tFontAscent = 0;
    var tFontDescent = 0;
    var tFontLeading = 0;
    var tKerningCount = 0;
    var tFontKerningTable = null;

    if (tNumGlyphs === 0) { // no Glyphs
      var tFont = Font.load(tReader, null, null);
      // Need to skip CodeTableOffset?
      //tFontFlagsWideOffsets ? tReader.getUint32() : tReader.getUint16();
      tFont.id = tId;
      tFont.shiftJIS = tFontFlagsShiftJIS;
      tFont.smalltext =tFontFlagsSmallText;
      tFont.ansi = tFontFlagsANSI;
      tFont.italic = tFontFlagsItalic;
      tFont.bold = tFontFlagsBold;
      tFont.langCode = tLangCode;
      tFont.name = tFontName;
      pParser.swf.fonts[tId] = tFont;
      if (tFontFlagsHasLayout) {
        tFontAscent = tReader.getInt16();
        tFontDescent = tReader.getInt16();
        tFontLeading = tReader.getInt16();

        tKerningCount = tReader.getUint16();
        tFontKerningTable = new Array(tKerningCount);

        for (var i = 0 ; i < tKerningCount; i++) {
          tFontKerningTable[i] = KERNINGRECORD.load(tReader, tFontFlagsWideCodes);
        }
        tFont.ascent = tFontAscent;
        tFont.descent = tFontDescent;
        tFont.leading = tFontLeading;
        tFont.kerningTable = tFontKerningTable;
      }
      return ;
    }
    var tOffsetTable = new Array(tNumGlyphs);
    var tCodeTableOffset = 0;
    var tOffsetOfOffsetTable = tReader.tell();

    if (tFontFlagsWideOffsets) {
      for (var i = 0 ; i < tNumGlyphs ; i++) {
        tOffsetTable[i] = tReader.getUint32();
      }

      tCodeTableOffset = tReader.getUint32();
    } else {
      for (var i = 0 ; i < tNumGlyphs ; i++) {
        tOffsetTable[i] = tReader.getUint16();
      }

      tCodeTableOffset = tReader.getUint16();
    }

    var tFont = Font.load(tReader, tOffsetOfOffsetTable, tOffsetTable);

    tReader.seekTo(tOffsetOfOffsetTable + tCodeTableOffset);

    var tCodeTable = new Array(tNumGlyphs);

    if (tFontFlagsWideCodes) {
      for (var i = 0 ; i < tNumGlyphs ; i++) {
        tCodeTable[i] = tReader.getUint16();
      }
    } else {
      for (var i = 0 ; i < tNumGlyphs ; i++) {
        tCodeTable[i] = tReader.getUint8();
      }
    }

    var tFontAdvanceTable = new Array(tNumGlyphs);
    var tFontBoundsTable = new Array(tNumGlyphs);

    if (tFontFlagsHasLayout) {
      tFontAscent = tReader.getInt16();
      tFontDescent = tReader.getInt16();
      tFontLeading = tReader.getInt16();

      for (var i = 0 ; i < tNumGlyphs ; i++) {
        tFontAdvanceTable[i] = tReader.getInt16();
      }

      for (var i = 0 ; i < tNumGlyphs ; i++) {
        tFontBoundsTable[i] = RECT.load(tReader);
      }

      tKerningCount = tReader.getUint16();
      tFontKerningTable = new Array(tKerningCount);

      for (var i = 0 ; i < tKerningCount; i++) {
        tFontKerningTable[i] = KERNINGRECORD.load(tReader, tFontFlagsWideCodes);
      }
    }

    tFont.id = tId;
    tFont.shiftJIS = tFontFlagsShiftJIS;
    tFont.smalltext =tFontFlagsSmallText;
    tFont.ansi = tFontFlagsANSI;
    tFont.italic = tFontFlagsItalic;
    tFont.bold = tFontFlagsBold;
    tFont.langCode = tLangCode;
    tFont.name = tFontName;
    tFont.ascent = tFontAscent;
    tFont.descent = tFontDescent;
    tFont.leading = tFontLeading;
    tFont.advanceTable = tFontAdvanceTable;
    tFont.boundsTable = tFontBoundsTable;
    tFont.kerningTable = tFontKerningTable;

    var buildLookupTable = function (pCodeTable) {
      // Create a lookup table for searching glyphs by char code.
      var tTable = new Object();
      var tShapes = tFont.shapes;

      for (var i = 0; i < tNumGlyphs; i++) {
        var tEntry = new Object();
        tEntry.shape = tShapes[i];

        if (tFontFlagsHasLayout) {
          tEntry.advance = tFontAdvanceTable[i];
          tEntry.bounds = tFontBoundsTable[i];
        }

        tTable[pCodeTable[i] + ''] = tEntry;
      }

      return tTable;
    };

    if (tFontFlagsShiftJIS && tCodeTable) {
      // Converts the code table into UCS characters.
      var tLength = tCodeTable.length, tCharCode;
      var tBuffer = Buffer.create(tLength * 2);
      var tData = tBuffer.data;

      for (var i = 0, j = 0, il = tLength; i < il; i++) {
        tCharCode = tCodeTable[i];

        if (tCharCode < 256) {
          tData[j++] = tCharCode;
        } else if (tCharCode < 65536) {
          tData[j++] = (tCharCode >> 8) & 0xff;
          tData[j++] = tCharCode & 0xff;
        }
      }
      var tDecoder = new Decoder('shift_jis');
      var tString = tDecoder.decode(tBuffer);
      var tCharCodeArray = new Array();

      for (var i = 0; i < tLength; i++) {
        if (tCharCode = tString.charCodeAt(i)) {
          tCharCodeArray.push(tCharCode);
        }
      }
      
      tFont.codeTable = tCharCodeArray;
      tFont.lookupTable = buildLookupTable(tCharCodeArray);
    } else {
      tFont.codeTable = tCodeTable;
      tFont.lookupTable = buildLookupTable(tCodeTable);
    }
    pParser.swf.fonts[tId] = tFont;
  }

}(this));

/**
 * @author Yoshihiro Yamazaki
 *
 * Copyright (C) 2012 QuickSWF project
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['37'] = defineEditText;

  var RECT = global.quickswf.structs.RECT;
  var RGBA = global.quickswf.structs.RGBA;

  /**
   * @constructor
   * @class {quickswf.structs.EditText}
   */
  function EditText() {
    this.id = -1;
    this.bounds = null;
    this.wordwrap = false;
    this.multiline = false;
    this.password = false;
    this.readonly = false;
    this.autosize = false;
    this.noselect = false;
    this.border = false;
    this.wasstatic = false;
    this.html = false;
    this.useoutline = false;
    this.font = 0;
    this.fontclass = null;
    this.fontheight = 0;
    this.textcolor = null;
    this.maxlength = 0;
    this.align = 0;
    this.leftmargin = 0;
    this.rightmargin = 0;
    this.indent = 0;
    this.leading = 0;
    this.variablename = null;
    this.initialtext = null;
  }

  EditText.prototype.displayListType = 'DefineEditText';

  /**
   * Loads a EditText type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.EditText} The loaded EditText.
   */
  EditText.load = function(pReader) {
    var tEditText = new EditText();
    return tEditText;
  };

  function defineEditText(pLength) {
    parseEditText(this);
  }

  function parseEditText(pParser) {
    var tReader = pParser.r;
    var tId = tReader.getUint16();
    var tBounds = RECT.load(tReader);
    var tFlags1 = tReader.getUint8();
    var tFlags2 = tReader.getUint8();
    var tHasText      = (tFlags1 & 0x80) ? true : false;
    var tWordWrap     = (tFlags1 & 0x40) ? true : false;
    var tMultiline    = (tFlags1 & 0x20) ? true : false;
    var tPassword     = (tFlags1 & 0x10) ? true : false;
    var tReadOnly     = (tFlags1 & 0x08) ? true : false;
    var tHasTextColor = (tFlags1 & 0x04) ? true : false;
    var tHasMaxLength = (tFlags1 & 0x02) ? true : false;
    var tHasFont      = (tFlags1 & 0x01) ? true : false;
    var tHasFontClass = (tFlags2 & 0x80) ? true : false;
    var tAutoSize     = (tFlags2 & 0x40) ? true : false;
    var tHasLayout    = (tFlags2 & 0x20) ? true : false;
    var tNoSelect     = (tFlags2 & 0x10) ? true : false;
    var tBorder       = (tFlags2 & 0x08) ? true : false;
    var tWasStatic    = (tFlags2 & 0x04) ? true : false;
    var tHTML         = (tFlags2 & 0x02) ? true : false;
    var tUseOutline   = (tFlags2 & 0x01) ? true : false;
    var tFontId = -1;
    var tFont = null;

    if (tHasFont) {
      tFontId = tReader.getUint16();
      tFont = pParser.swf.fonts[tFontId + ''];
    }

    var tFontClass = null;

    if (tHasFontClass) {
      tFontClass = tReader.getString();
    }

    var tFontHeight = 0;

    if (tHasFont) {
      tFontHeight = tReader.getUint16();
    }

    var tTextColor = null;

    if (tHasTextColor) {
      tTextColor = RGBA.load(tReader, true);
    }

    var tMaxLength = 0;

    if (tHasMaxLength) {
      tMaxLength = tReader.getUint16();
    }

    var tAlign = 0;
    var tLeftMargin = 0;
    var tRightMargin = 0;
    var tIndent = 0;
    var tLeading = 0;

    if (tHasLayout) {
      tAlign = tReader.getUint8();
      tLeftMargin = tReader.getUint16();
      tRightMargin = tReader.getUint16();
      tIndent = tReader.getUint16();
      tLeading = tReader.getUint16();
    }

    var tVariableName = tReader.getString();
    var tInitialText = null;

    if (tHasText) {
      tInitialText = tReader.getString();
    }

    var tEditText = EditText.load(tReader);

    tEditText.id = tId;
    tEditText.bounds = tBounds;
    tEditText.wordwrap = tWordWrap;
    tEditText.multiline = tMultiline;
    tEditText.password = tPassword;
    tEditText.readonly = tReadOnly;
    tEditText.autosize = tAutoSize;
    tEditText.noselect = tNoSelect;
    tEditText.border = tBorder;
    tEditText.wasstatic = tWasStatic;
    tEditText.html = tHTML;
    tEditText.useoutline = tUseOutline;
    tEditText.font = tFontId;
    tEditText.fontclass = tFontClass;
    tEditText.fontheight = tFontHeight;
    tEditText.textcolor = tTextColor;
    tEditText.maxlength = tMaxLength;
    tEditText.align = tAlign;
    tEditText.leftmargin = tLeftMargin;
    tEditText.rightmargin = tRightMargin;
    tEditText.indent = tIndent;
    tEditText.leading = tLeading;
    tEditText.variablename = tVariableName;
    tEditText.initialtext = tInitialText;

    pParser.register(tId, tEditText);
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {
  
  global.quickswf.Parser.prototype['1'] = showFrame;

  function showFrame(pLength) {
    var tCurrentFrame = this.currentFrame;

    if (this.currentSprite.frames[tCurrentFrame] === void 0) {
      this.currentSprite.frames[tCurrentFrame] = [];
    }

    this.currentFrame = tCurrentFrame + 1;
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['5'] = parseRemoveObject;
  global.quickswf.Parser.prototype['28'] = parseRemoveObject2;

  function parseRemoveObject(pLength) {
    this.r.getUint16();
    parseRemoveObject2.call(this, pLength);
  }

  function parseRemoveObject2(pLength) {
    var tDepth = this.r.getUint16();
    this.add({
      type: 'remove',
      depth: tDepth
    });
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['4'] = placeObject;
  global.quickswf.Parser.prototype['26'] = placeObject2;

  var MATRIX = global.quickswf.structs.MATRIX;
  var CXFORM = global.quickswf.structs.CXFORM;
  var CLIPACTIONS = global.quickswf.structs.CLIPACTIONS;

  function placeObject(pLength) {
    var tReader = this.r;
    var tId = tReader.getUint16();
    var tDepth = tReader.getUint16();
    var tMatrix = MATRIX.load(tReader);

    var tPackage = {
      type: 'add',
      id: tId,
      matrix: tMatrix,
      depth: tDepth,
      name: null
    };

    this.add(tPackage);
  }

  function placeObject2(pLength) {
    var tReader = this.r;
    var tStartIndex = tReader.tell();

    var tFlags = tReader.getUint8();
    var tDepth = tReader.getUint16();

    var tPackage = {
      type: '',
      id: -1,
      matrix: null,
      depth: tDepth,
      name: null
    };

    var tColorTransform = null;
    var tClipDepth = 0;
    var tRatio = -1;

    var tId;
    if (tFlags & (1 << 1)) { // hasCharacter
      tId = tPackage.id = tReader.getUint16();
    }

    if (tFlags & (1 << 2)) { // hasMatrix
      tPackage.matrix = MATRIX.load(tReader);
    }

    if (tFlags & (1 << 3)) { // hasColorTransform
      tColorTransform = CXFORM.load(tReader, true);
    }

    if (tFlags & (1 << 4)) { // hasRatio
      tRatio = tReader.getUint16();
    }

    if (tFlags & (1 << 5)) { // hasName
      tPackage.name = tReader.getString();
    }

    if (tFlags & (1 << 6)) {
      tClipDepth = tReader.getUint16();
    }

    var tClipActions = null;
    
    if (tFlags & (1 << 7)) {
      tClipActions = CLIPACTIONS.load(tReader, this.swf.version);
      this.add({
        type: 'clipActions',
        clipActions: tClipActions
      });
    }

    var tMove = tFlags & 1;

    if (tMove && tId !== void 0) {
      tPackage.type = 'replace';
      this.add(tPackage);
    } else if (!tMove && tId !== void 0) {
      tPackage.type = 'add';
      this.add(tPackage);
    } else if (tMove && tId === void 0 && tPackage.matrix) {
      tPackage.type = 'move';
      this.add(tPackage);
    }

    if (tClipDepth > 0) {
      this.add({
        type: 'clip',
        depth: tDepth,
        clipDepth: tClipDepth,
        clipActions: tClipActions
      });
    }

    if (tColorTransform !== null) {
      this.add({
         type: 'colorTransform',
         depth: tDepth,
         colorTransform: tColorTransform
       });
    }

    if (tRatio !== -1) {
      this.add({
        type: 'ratio',
        depth: tDepth,
        ratio: tRatio
      });
    }

    if (tReader.tell() < tStartIndex + pLength) {
      /*
      tClipActions = CLIPACTIONS.load(tReader, this.swf.version);
      this.add({
        type: 'clipActions',
        clipActions: tClipActions
      });
      // It's not following the spec....
      */
    }
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['9'] = setBackgroundColor;

  var RGBA = global.quickswf.structs.RGBA;

  function setBackgroundColor(pLength) {
    // TODO: support wmmode transparent.
    var tRGBA = RGBA.load(this.r, false);
    this.add({type: 'background', color: tRGBA});
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['43'] = frameLabel;

  function frameLabel(pLength) {
    var tLabel = this.r.getString();
    if (!(tLabel in this.currentSprite.frameLabels)) {
      this.currentSprite.frameLabels[tLabel] = this.currentFrame;
    }
  }

}(this));


/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {
  
  global.quickswf.Parser.prototype['0'] = end;

  function end(pLength) {
    this.currentSprite = this.spriteStack.pop();
    this.currentFrame = this.frameStack.pop();
  }

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 QuickSWF project
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['7'] = defineButton;
  global.quickswf.Parser.prototype['34'] = defineButton2;

  var MATRIX = global.quickswf.structs.MATRIX;
  var CXFORM = global.quickswf.structs.CXFORM;

  /**
   * @constructor
   * @class {quickswf.structs.Button}
   */
  function Button(pId, pRecordList, pCondActionList, pTrackAsMenu) {
    this.id = pId;
    this.records = pRecordList;
    this.condActions = pCondActionList;
    this.isMenu = pTrackAsMenu;
  }

  Button.prototype.displayListType = 'DefineButton';

  /**
   * @constructor
   * @class {quickswf.structs.BUTTONRECORD}
   */
  function BUTTONRECORD(pId, pDepth, pMatrix, pStates, pCx, pFl, pBm) {
    this.id = pId;
    this.depth = pDepth;
    this.matrix = pMatrix;
    this.colorTransform = pCx;
    this.filterList = pFl;
    this.blendMode = pBm;
    this.state = {
        hitTest : (pStates >> 3) & 0x1,
        down    : (pStates >> 2) & 0x1,
        over    : (pStates >> 1) & 0x1,
        up      : (pStates >> 0) & 0x1
      };
  }


  /**
   * Loads a BUTTONRECORD type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.BUTTONRECORD} The loaded BUTTONRECORD.
   */
  BUTTONRECORD.load = function(pReader, pWithinDB2) {
    var tFlags  = pReader.getUint8();
    var tId     = pReader.getUint16();
    var tDepth  = pReader.getUint16();
    var tMatrix = MATRIX.load(pReader);
    var tButtonStates = tFlags & 0xf;
    var tColorTransform = null;
    var tHasBlendMode  = (tFlags >> 5) & 0x1;
    var tHasFilterList = (tFlags >> 4) & 0x1;
    var i, tFilterNum, tFilterId, tBytesToSkip;

    if (pWithinDB2) {
      tColorTransform = CXFORM.load(pReader, true);
      if (tHasFilterList) {
        // Just skipping...
        tBytesToSkip = [23, 9, 15, 27, NaN, NaN, 80, NaN];
        tFilterNum = pReader.getUint8();
        for (i = 0; i < tFilterNum; i++) {
          tFilterId = pReader.getUint8();
          pReader.seek(tBytesToSkip[tFilterId]);
        }
      }
      if (tHasBlendMode) {
        // Just skipping...
        pReader.seek(1);
      }
    }
    return new BUTTONRECORD(tId, tDepth, tMatrix, tButtonStates,
                tColorTransform, null, null);
  };

  /**
   * @constructor
   * @class {quickswf.structs.BUTTONCONDACTION}
   */
  function BUTTONCONDACTION(pCond, pAction) {
    this.cond = pCond;
    this.action = pAction;
  }


  /**
   * Loads a BUTTONCONDACTION type.
   * @param {quickswf.Reader} pReader The reader to use.
   * @return {quickswf.structs.BUTTONCONDACTION} The loaded BUTTONCONDACTION.
   */
  BUTTONCONDACTION.load = function(pReader, pBounds) {
    var tSize = pReader.getUint16();
    var tFlags = pReader.getUint16();
    var tIndex = pReader.tell();
    var tLength = tSize ? tSize - 4 : pBounds - tIndex;
    var tButtonAction = pReader.getCopy(tLength);

    var tCond = {
        idleToOverDown    : (tFlags >>  7) & 0x1,
        outDownToIdle     : (tFlags >>  6) & 0x1,
        outDownToOverDown : (tFlags >>  5) & 0x1,
        overDownToOutDown : (tFlags >>  4) & 0x1,
        overDownToOverUp  : (tFlags >>  3) & 0x1,
        overUpToOverDown  : (tFlags >>  2) & 0x1,
        overUpToIdle      : (tFlags >>  1) & 0x1,
        idleToOverUp      : (tFlags >>  0) & 0x1,
        keyPress          : (tFlags >>  9) & 0x7f,
        overDownToIdle    : (tFlags >>  8) & 0x1
      };

    return new BUTTONCONDACTION(tCond, tButtonAction);
  };

  function defineButton(pLength) {
    var tReader = this.r;
    var tBounds = tReader.tell() + pLength;
    var tId = tReader.getUint16();

    // Parse button records. (n >= 1)
    var tButtonRecords = new Array();
    do {
      tButtonRecords.push(BUTTONRECORD.load(tReader, false));
    } while (tReader.peekBits(8));
    tReader.getUint8(); // Last one byte

    // ActionScript
    var tButtonAction = tReader.getCopyTo(tBounds);

    // Store the button records to the dictionary.
    var tCondAction = new BUTTONCONDACTION(null, tButtonAction);
    this.register(tId, new Button(tId, tButtonRecords, [tCondAction], false));
  }

  function defineButton2(pLength) {
    var tReader = this.r;
    var tBounds = tReader.tell() + pLength;
    var tId = tReader.getUint16();
    var tFlags  = tReader.getUint8();
    var tTrackAsMenu = tFlags & 1;
    var tActionOffset = tReader.getUint16();

    if (tActionOffset > 3 || tActionOffset === 0) {
      // Parse button records. (n >= 1)
      var tButtonRecords = new Array();
      while (tReader.peekBits(8)) {
        tButtonRecords.push(BUTTONRECORD.load(tReader, true));
      }
    }
    tReader.getUint8(); // Last one byte

    // Condition + ActionScript
    var tButtonActions = new Array();
    if (tActionOffset > 0) {
      var tLast, tCondAction;
      do {
        tLast = tReader.peekBits(16) === 0;
        tCondAction = BUTTONCONDACTION.load(tReader, tBounds);
        tButtonActions.push(tCondAction);
      } while (!tLast);
    }
    // Store the button records to the dictionary.
    this.register(tId, new Button(tId, tButtonRecords, tButtonActions, tTrackAsMenu));
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  global.quickswf.Parser.prototype['12'] = doAction;

  function doAction(pLength) {
    this.add({
      type: 'script',
      script: this.r.getCopy(pLength)
    });
  }

}(this));

/**
 * @author Yuta Imaya
 * @author Jason Parrott
 *
 * Copyright (C) 2014 QuickSWF Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {
  quickswf.Parser.prototype['20'] = defineBitsLossless;
  quickswf.Parser.prototype['36'] = defineBitsLossless2;

  var fromBuffer = benri.content.Blob.fromBuffer;
  var Buffer = benri.io.Buffer;

  //var mHaveAndroidAlphaBug = quickswf.browser.HavePutImageDataAlphaBug;
  var mAdler32 = quickswf.utils.Adler32;
  var mCRC32 = quickswf.utils.CRC32;

  /** @const @type {number} */
  var mBlockSize = 0xffff;

  /**
   * @this {quickswf.Parser}
   * @param {number} pLength tag length.
   */
  function defineBitsLossless(pLength) {
    /** @type {number} */
    var tId = this.r.getUint16();
    /** @type {Lossless} */
    var tLossless = new Lossless(this, pLength, false);

    tLossless.parse();

    tLossless.getImage(tId);
    /*if (tLossless.format === LosslessFormat.COLOR_MAPPED && mHaveCreateObjectURL) {
      tLossless.getImage(tId);
    } else {
      tLossless.getCanvas(tId);
    }*/
  }

  /**
   * @param {number} pLength tag length.
   */
  function defineBitsLossless2(pLength) {
    /** @type {number} */
    var tId = this.r.getUint16();
    /** @type {Lossless} */
    var tLossless = new Lossless(this, pLength, true);

    tLossless.parse();

    tLossless.getImage(tId);
    /*if (tLossless.format === LosslessFormat.COLOR_MAPPED && mHaveCreateObjectURL) {
      tLossless.getImage(tId);
    } else {
      tLossless.getCanvas(tId);
    }*/
  }

  /**
   * @enum {number}
   */
  var LosslessFormat = {
    COLOR_MAPPED: 3,
    RGB15: 4,
    RGB24: 5
  };

  /**
   * @enum {number}
   */
  var PngColourType = {
    GRAYSCALE: 0,
    TRUECOLOR: 2,
    INDEXED_COLOR: 3,
    GRAYSCALE_WITH_ALPHA: 4,
    TRUECOLOR_WITH_ALPHA: 6
  };

  /**
   * lossless image parser.
   * @param {quickswf.Parser} parser swf parser object.
   * @param {number} pLength tag length.
   * @param {boolean=} withAlpha alpha channel support flag.
   * @constructor
   */
  function Lossless(parser, pLength, withAlpha) {
    /** @type {SWF} */
    this.swf = parser.swf;
    /** @type {Breader} */
    this.reader = parser.r;
    /** @type {number} */
    this.size = pLength - (2 + 1 + 2 + 2);
    /** @type {number} */
    this.width;
    /** @type {number} */
    this.height;
    /** @type {!(Array.<number>|Uint8Array)} */
    this.plain;
    /** @type {LosslessFormat} */
    this.format;
    /** @type {PngColourType} */
    this.colourType;
    /** @type {!(Array.<number>|Uint8Array)} */
    this.palette;
    /** @type {!Uint8Array} */
    this.png;
    /** @type {number} */
    this.pp = 0;
    /** @type {number} */
    this.withAlpha = withAlpha ? 1 : 0;

    if (withAlpha) {
      this.writeIDAT = this.writeIDATwithAlpha;
    }
  }

  /**
   * @return {number}
   */
  Lossless.prototype.calcBufferSize = function() {
    /** @type {number} */
    var size = 0;
    /** @type {number} */
    var pixelWidth;
    /** @type {number} */
    var imageSize;

    // PNG Signature
    size += 8;

    // IHDR
    size += /* IHDR data */ 13 + /* chunk */ 12;

    // PLTE
    if (this.colourType === PngColourType.INDEXED_COLOR) {
      size += /* PLTE data */ this.palette.length + /* chunk */ 12;

      // tRNS
      if (this.withAlpha) {
        size += /* tRNS data */ this.trns.length + /* chunk */ 12;
      }

      pixelWidth = 1;
    } else {
      pixelWidth = this.withAlpha ? 4 : 3;
    }

    // IDAT
    imageSize = (this.width * pixelWidth + /* filter */ 1) * this.height;
    size += ( /* ZLIB non-compressed */
      /* cmf    */ 1 +
      /* flg    */ 1 +
      /* data   */ imageSize +
      /* header */ (
      (/* bfinal, btype */ 1 +
        /* len           */ 2 +
        /* nlen          */ 2) *
        /* number of blocks */ (1 + (imageSize / mBlockSize | 0))
      ) +
      /* adler  */ 4
    ) + 12;

    // IEND
    size += /* chunk*/ 12;

    return size;
  };

  /**
   * parse lossless image.
   */
  Lossless.prototype.parse = function() {
    /** @type {Breader} */
    var tReader = this.reader;
    /** @type {LosslessFormat} */
    var tFormat = this.format = tReader.getUint8();
    /** @type {number} */
    var tPaletteSize;
    /** @type {!(Array.<number>|Uint8Array)} */
    var tPalette;
    var tPaletteData;
    /** @type {number} */
    var tPp = 0;
    /** @type {number} */
    var tTp = 0;
    /** @type {!(Array.<number>|Uint8Array)} */
    var tTmpPalette;
    /** @type {!(Array.<number>|Uint8Array)} */
    var tTrns;
    var tTrnsData;
    /** @type {number} */
    var alpha;
    /** @type {number} */
    var bufferSize;
    /** @type {number} */
    var i;

    this.width = tReader.getUint16();
    this.height = tReader.getUint16();

    // indexed-color
    if (tFormat === LosslessFormat.COLOR_MAPPED) {
      this.colourType = PngColourType.INDEXED_COLOR;

      // palette
      tPaletteSize = (tReader.getUint8() + 1);
      if (this.withAlpha) {
        tTrns = this.trns = Buffer.create(tPaletteSize);
        tTrnsData = tTrns.data;
      }
      tPaletteSize *= (3 + this.withAlpha);
      --this.size;

      // buffer size
      bufferSize = tPaletteSize +
        /* width with padding * height */((this.width + 3) & -4) * this.height;
    // truecolor
    } else {
      this.colourType = (!this.withAlpha) ?
        PngColourType.TRUECOLOR : PngColourType.TRUECOLOR_WITH_ALPHA;

      // buffer size
      if (tFormat === LosslessFormat.RGB24) {
        bufferSize = 4 * this.width * this.height;
      } else if (tFormat === LosslessFormat.RGB15) {
        bufferSize = 2 * this.width * this.height;
      }
    }

    // compressed image data
    this.plain = (new benri.io.compression.Inflator('inflate'))
    .inflate(
      tReader.getCopy(this.size),
      {
        bufferSize: bufferSize
      } 
    );

    // palette
    if (tFormat === LosslessFormat.COLOR_MAPPED) {
      if (!this.withAlpha) {
        // RGB palette
        this.palette = this.plain.copy(0, tPaletteSize);
      } else {
        // RGBA palette
        tTmpPalette = this.plain.copy(0, tPaletteSize).data;
        tPalette = this.palette = Buffer.create(tPaletteSize * 3 / 4);
        tPaletteData = tPalette.data;

        for (i = 0; tTp < tPaletteSize; i += 4) {
          alpha = tTrnsData[tTp++] = tTmpPalette[i + 3];
          tPaletteData[tPp++] = tTmpPalette[i    ] * 255 / alpha | 0; // red
          tPaletteData[tPp++] = tTmpPalette[i + 1] * 255 / alpha | 0; // green
          tPaletteData[tPp++] = tTmpPalette[i + 2] * 255 / alpha | 0; // blue
        }
      }

      this.plain = this.plain.copyTo(tPaletteSize, this.plain.size);
    }
  };

  /**
   * create new Image element.
   * @param {number} pId The ID of this image.
   * @return {Object} Image information.
   */
  Lossless.prototype.getImage = function(pId) {
    /** @type {benri.io.Buffer} */
    var tPng = this.getPNG();

    this.swf.assetManifest.addBuffer(pId + '', tPng, 'image/png');
  };

  /**
   * create PNG buffer.
   * @return {benri.io.Buffer} png buffer.
   */
  Lossless.prototype.getPNG = function() {
    this.png = Buffer.create(this.calcBufferSize());

    this.writeSignature();
    this.writeIHDR();

    if (this.format === LosslessFormat.COLOR_MAPPED) {
      this.writePLTE();

      if (this.withAlpha) {
        this.writeTRNS();
      }
    }

    this.writeIDAT();
    this.writeIEND();

    this.finish();

    return this.png;
  };

  /**
   * truncate output buffer.
   * @return {benri.io.Buffer} png bytearray.
   */
  Lossless.prototype.finish = function() {
    this.png = this.png.copyTo(0, this.pp);

    return this.png;
  };

  /**
   * write png signature.
   */
  Lossless.prototype.writeSignature = function() {
    /** @const @type {Array.<number>} */
    var signature = Buffer.fromArray([137, 80, 78, 71, 13, 10, 26, 10]);

    this.png.copyFrom(signature, this.pp);

    this.pp += 8;
  };

  /**
   * write png chunk.
   * @param {string} pType chunk type.
   * @param {!(Array.<number>|Uint8Array)} pData chunk data.
   */
  Lossless.prototype.writeChunk = function(pType, pData) {
    /** @type {number} */
    var tDataLength = pData.length;
    /** @type {Array.<number>} */
    var tTypeArray = [
      pType.charCodeAt(0) & 0xff, pType.charCodeAt(1) & 0xff,
      pType.charCodeAt(2) & 0xff, pType.charCodeAt(3) & 0xff
    ];
    /** @type {number} */
    var tCrc32;

    var tPng = this.png;
    var tPngData = tPng.data;
    var tPp = this.pp;

    // length
    tPngData[tPp++] = (tDataLength >> 24) & 0xff;
    tPngData[tPp++] = (tDataLength >> 16) & 0xff;
    tPngData[tPp++] = (tDataLength >>  8) & 0xff;
    tPngData[tPp++] = (tDataLength      ) & 0xff;

    // type
    tPngData[tPp++] = tTypeArray[0];
    tPngData[tPp++] = tTypeArray[1];
    tPngData[tPp++] = tTypeArray[2];
    tPngData[tPp++] = tTypeArray[3];

    // data
    tPng.copyFrom(pData, tPp);
    tPp += tDataLength;

    // crc32
    tCrc32 = mCRC32.update(pData, mCRC32.calc(Buffer.fromArray(tTypeArray)));
    tPngData[tPp++] = (tCrc32 >> 24) & 0xff;
    tPngData[tPp++] = (tCrc32 >> 16) & 0xff;
    tPngData[tPp++] = (tCrc32 >>  8) & 0xff;
    tPngData[tPp++] = (tCrc32      ) & 0xff;

    this.pp = tPp;
  };

  /**
   * write PNG IHDR chunk.
   */
  Lossless.prototype.writeIHDR = function() {
    /** @type {number} */
    var tWidth = this.width;
    /** @type {number} */
    var tHeight = this.height;
    /** @type {PngColourType} */
    var tColourType = this.colourType;

    this.writeChunk('IHDR', Buffer.fromArray([
      /* width       */
      (tWidth  >> 24) & 0xff, (tWidth  >> 16) & 0xff,
      (tWidth  >>  8) & 0xff, (tWidth       ) & 0xff,
      /* height      */
      (tHeight >> 24) & 0xff, (tHeight >> 16) & 0xff,
      (tHeight >>  8) & 0xff, (tHeight      ) & 0xff,
      /* bit depth   */ 8,
      /* colour type */ tColourType,
      /* compression */ 0,
      /* filter      */ 0,
      /* interlace   */ 0
    ]));
  };

  /**
   * write PNG PLTE chunk.
   */
  Lossless.prototype.writePLTE = function() {
    this.writeChunk('PLTE', this.palette);
  };

  /**
   * write PNG tRNS chunk.
   */
  Lossless.prototype.writeTRNS = function() {
    this.writeChunk('tRNS', this.trns);
  };

  /**
   * wrtie PNG IDAT chunk.
   */
  Lossless.prototype.writeIDAT = function() {
    /** @type {number} */
    var tSize;
    /** @type {number} */
    var tLength;
    /** @type {!(Array.<number>|Uint8Array)} */
    var tImage;
    var tImageData;
    /** @type {number} */
    var tOp = 0;
    /** @type {number} */
    var tIp = 0;
    /** @type {number} */
    var tRed;
    /** @type {number} */
    var tGreen;
    /** @type {number} */
    var tBlue;
    /** @type {number} */
    var tReserved;
    /** @type {number} */
    var tX = 0;
    /** @type {number} */
    var tWidthWithPadding;

    var tPlain = this.plain;
    var tPlainData = tPlain.data;
    var tWidth = this.width;
    var tHeight = this.height;
    var tFormat = this.format;

    // calculate buffer size
    switch (this.colourType) {
      case PngColourType.INDEXED_COLOR:
        tLength = tWidth;
        break;
      case PngColourType.TRUECOLOR:
        tLength = tWidth * 3;
        break;
      default:
        quickswf.logger.warn('Invalid png colour type');
    }

    tSize = tLength * tHeight + tHeight;

    // create png idat data
    tImage = Buffer.create(tSize);
    tImageData = tImage.data;
    
    if (tFormat === LosslessFormat.COLOR_MAPPED) {
      // indexed-color png
      tWidthWithPadding = (tWidth + 3) & -4;

      while (tOp < tSize) {
        // scanline filter
        tImageData[tOp++] = 0;

        // write color-map index
        tImage.copyFrom(tPlain.copyTo(tIp, tIp + tWidth), tOp);
        tOp += tWidth;

        // next
        tIp += tWidthWithPadding;
      }
    } else {
      // truecolor png
      while (tOp < tSize) {
        // scanline filter
        if (tX++ % tWidth === 0) {
          tImageData[tOp++] = 0;
        }

        // read RGB
        if (tFormat === LosslessFormat.RGB24) {
          tReserved = tPlainData[tIp++];
          tRed      = tPlainData[tIp++];
          tGreen    = tPlainData[tIp++];
          tBlue     = tPlainData[tIp++];
        } else if (tFormat === LosslessFormat.RGB15) {
          tReserved = (tPlainData[tIp++] << 8) | tPlainData[tIp++];
          tRed   = (tReserved >> 7) & 0xf8; // >> 10 << 3, 0x1f << 3
          tGreen = (tReserved >> 2) & 0xf8; // >> 5  << 3, 0x1f << 3
          tBlue  = (tReserved << 3) & 0xf8; //       << 3, 0x1f << 3
        }

        // write RGB
        tImageData[tOp++] = tRed;
        tImageData[tOp++] = tGreen;
        tImageData[tOp++] = tBlue;
      }
    }

    this.writeChunk('IDAT', this.fakeZlib(tImage));
  };

  /**
   * wrtie PNG IDAT chunk (with alpha channel).
   */
  Lossless.prototype.writeIDATwithAlpha = function() {
    /** @type {number} */
    var tSize;
    /** @type {number} */
    var tLength;
    /** @type {!(Array.<number>|Uint8Array)} */
    var tImage;
    var tImageData;
    /** @type {number} */
    var tOp = 0;
    /** @type {number} */
    var tIp = 0;
    /** @type {number} */
    var tRed;
    /** @type {number} */
    var tGreen;
    /** @type {number} */
    var tBlue;
    /** @type {number} */
    var tAlpha;
    /** @type {number} */
    var tX = 0;
    /** @type {number} */
    var tWidthWithPadding;

    var tPlain = this.plain;
    var tPlainData = tPlain.data;
    var tWidth = this.width;
    var tHeight = this.height;
    var tFormat = this.format;

    // calculate buffer size
    switch (this.colourType) {
      case PngColourType.INDEXED_COLOR:
        tLength = tWidth;
        break;
      case PngColourType.TRUECOLOR_WITH_ALPHA:
        tLength = tWidth * 4;
        break;
      default:
        quickswf.logger.warn('Invalid png colour type');
    }

    tSize = (tLength + 1) * tHeight;

    // create png idat data
    tImage = Buffer.create(tSize);
    tImageData = tImage.data;
    
    if (tFormat === LosslessFormat.COLOR_MAPPED) {
      // indexed-color png
      tWidthWithPadding = (tWidth + 3) & -4;

      while (tOp < tSize) {
        // scanline filter
        tImageData[tOp++] = 0;

        // write color-map index
        tImage.copyFrom(tPlain.copyTo(tIp, tIp + tWidth), tOp);
        tOp += tWidth;

        // next
        tIp += tWidthWithPadding;
      }
    } else {
      // truecolor png
      while (tOp < tSize) {
        // scanline filter
        if (tX++ % tWidth === 0) {
          tImageData[tOp++] = 0;
        }

        // read RGB
        tAlpha = tPlainData[tIp++];
        tRed   = tPlainData[tIp++] * 255 / tAlpha | 0;
        tGreen = tPlainData[tIp++] * 255 / tAlpha | 0;
        tBlue  = tPlainData[tIp++] * 255 / tAlpha | 0;

        // write RGB
        tImageData[tOp++] = tRed;
        tImageData[tOp++] = tGreen;
        tImageData[tOp++] = tBlue;
        tImageData[tOp++] = tAlpha;
      }
    }

    this.writeChunk('IDAT', this.fakeZlib(tImage));
  };

  /**
   * wrtie PNG IEND chunk.
   */
  Lossless.prototype.writeIEND = function() {
    this.writeChunk('IEND', Buffer.fromArray([]));
  };

  /**
   * create non-compressed zlib buffer.
   * @param {!(Array.<number>|Uint8Array)} pData plain data.
   * @return {!(Array.<number>|Uint8Array)}
   */
  Lossless.prototype.fakeZlib = function(pData) {
    /** @type {number} */
    var tBfinal;
    /** @type {number} */
    var tBtype = 0; // Non-compressed
    /** @type {number} */
    var tLen;
    /** @type {number} */
    var tNlen;
    /** @type {!(Array.<number>|Uint8Array)} */
    var tBlock;
    /** @type {number} */
    var tAdler32;
    /** @type {number} */
    var tIp = 0;
    /** @type {number} */
    var tOp = 0;
    /** @type {number} */
    var tSize = (
      /* cmf    */ 1 +
      /* flg    */ 1 +
      /* data   */ pData.length +
      /* header */ (
        (/* bfinal, btype */ 1 +
         /* len           */ 2 +
         /* nlen          */ 2) *
         /* number of blocks */ (1 + (pData.length / mBlockSize | 0))
      ) +
      /* adler  */ 4
    );
    /** @type {Uint8Array} */
    var tOutput = Buffer.create(tSize);
    var tOutputData = tOutput.data;

    // zlib header
    tOutputData[tOp++] = 0x78; // CINFO: 7, CMF: 8
    tOutputData[tOp++] = 0x01; // FCHECK: 1, FDICT, FLEVEL: 0

    // zlib body
    do {
      tBlock = pData.copyTo(tIp, tIp += mBlockSize);
      tBfinal = (tBlock.length < mBlockSize || tIp + tBlock.length === pData.length) ? 1 : 0;

      // block header
      tOutputData[tOp++] = tBfinal;

      // len
      tLen = tBlock.length;
      tOutputData[tOp++] = (tLen      ) & 0xff;
      tOutputData[tOp++] = (tLen >>> 8) & 0xff;

      // nlen
      tNlen = 0xffff - tLen;
      tOutputData[tOp++] = (tNlen      ) & 0xff;
      tOutputData[tOp++] = (tNlen >>> 8) & 0xff;

      // data
      tOutput.copyFrom(tBlock, tOp);
      tOp += tBlock.length;
    } while (!tBfinal);

    // adler-32
    tAdler32 = mAdler32(pData);
    tOutputData[tOp++] = (tAdler32 >> 24) & 0xff;
    tOutputData[tOp++] = (tAdler32 >> 16) & 0xff;
    tOutputData[tOp++] = (tAdler32 >>  8) & 0xff;
    tOutputData[tOp++] = (tAdler32      ) & 0xff;

    return tOutput;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 Jason Parrott.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  quickswf.Parser.prototype['6'] = defineBits;
  quickswf.Parser.prototype['8'] = defineJpegTable;
  quickswf.Parser.prototype['21'] = defineBitsJpeg2;
  quickswf.Parser.prototype['35'] = defineBitsJpeg3;

  var fromBuffer = benri.content.Blob.fromBuffer;
  var Buffer = benri.io.Buffer;

  function defineBits(pLength) {
    var tId = this.r.getUint16();
    getJPEG(tId, this, pLength - 2);
  }

  function defineBitsJpeg2(pLength) {
    var tReader = this.r;
    var tId = tReader.getUint16();

    if (tReader.getString(4, 'ascii') === '\x89PNG') { // PNG file
      tReader.seek(-4);
      this.swf.assetManifest.addBuffer(tId + '', tReader.getCopy(pLength - 2), 'image/png');
    } else { // JPEG file
      tReader.seek(-4);
      getJPEG(tId, this, pLength - 2);
    }
  }

  function defineBitsJpeg3(pLength) {
    var tReader = this.r;

    var tId = tReader.getUint16();
    var tAlphaOffset = tReader.getUint32();

    var tBlob, tDelay, tSelf = this;
    var tAlphaData;

    if (tReader.getString(4, 'ascii') === '\x89PNG') { // PNG file
      quickswf.logger.error('PNG in DefineBitsJpeg3');
    } else {
      tReader.seek(-4);
      // JPEG file
      getJPEG(tId, this, tAlphaOffset);
      // alpha table
      tAlphaData = (new benri.io.compression.Inflator('inflate'))
        .inflate(tReader.getCopy(pLength - 6 - tAlphaOffset));

      this.swf.assetManifest.onEntryLoad(tId + '', createOnJpeg3NonAlphaLoad(tAlphaData, tId + ''));
    }
  }

  function createOnJpeg3NonAlphaLoad(pAlphaData, pId) {
    return function onLoad(pData, pManifest) {
      pManifest.ignoreEntryLoad(pId, onLoad);

      // replace the pixel data with the pixel + alpha data.
      var tImage = pData.blob;
      var tWidth = tImage.getWidth();
      var tHeight = tImage.getHeight();
      var tAlphaData = pAlphaData.data;
      var tIndex, tLength;
      var tAlpha, tInverseAlpha;

      var tPixelArray = tImage.getBytes();

      for (tIndex = 0, tLength = tAlphaData.length; tIndex < tLength; ++tIndex) {
        tAlpha = tAlphaData[tIndex];
        tInverseAlpha = 255 / tAlpha;

        tPixelArray[tIndex * 4] *= tInverseAlpha;
        tPixelArray[tIndex * 4 + 1] *= tInverseAlpha;
        tPixelArray[tIndex * 4 + 2] *= tInverseAlpha;
        tPixelArray[tIndex * 4 + 3] = tAlpha;
      }

      tImage.setBytes(tPixelArray, 0, 0, tWidth, tHeight);
    };
  }

  function getJPEG(pId, pParser, pLength) {
    var tReader = pParser.r;
    var tLastByte = tReader.tell() + pLength;
    var tTag;
    var tTagLength;

    var tSOS = null;
    var tAPP0 = [0xFF, 0xE0, 0x0, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x0, 0x01, 0x01, 0x01, 0x0, 0x48, 0x0, 0x48, 0x0, 0x0];
    var tSOF0 = null;
    var tSOF2 = null;
    var tDQT = null;
    var tDHT = null;
    var tDRI = null;

    var tNewDQT;
    var tNewDHT;

    while (tReader.tell() < tLastByte) {
      if (tReader.getUint8() !== 0xFF) {
        quickswf.logger.error('Could not read JPEG.');

        return null;
      }

      tTag = tReader.getUint8();

      if (tTag === 0xD8 || tTag === 0xD9) { // SOI and EOI
        //ignore
        continue;
      } else if (tTag === 0xDA) { // SOS. No length
        tReader.seek(-2);
        tSOS = tReader.getCopyTo(tLastByte);
      } else {
        tTagLength = tReader.getUBits(16) + 2;

        tReader.align();
        tReader.seek(-4);

        switch (tTag) {
          case 0xE0: // APP0
            tAPP0 = tReader.getCopy(tTagLength);

            break;
          case 0xDB: // DQT
            if (tDQT === null) {
              tDQT = tReader.getCopy(tTagLength);
            } else {
              tNewDQT = Buffer.fromParts([
                tDQT,
                tReader.getCopy(tTagLength)
              ]);

              tDQT = tNewDQT;
            }

            break;
          case 0xC4: // DHT
            if (tDHT === null) {
              tDHT = tReader.getCopy(tTagLength);
            } else {
              tNewDHT = Buffer.fromParts([
                tDHT,
                tReader.getCopy(tTagLength)
              ]);

              tDHT = tNewDHT;
            }

            break;
          case 0xC0: // SOF0
            tSOF0 = tReader.getCopy(tTagLength);

            break;
          case 0xC2: // SOF2
            tSOF2 = tReader.getCopy(tTagLength);

            break;
          case 0xDD: // DRI
            tDRI = tReader.getCopy(tTagLength);

            break;
          default:
            quickswf.logger.notice('Unknown JPEG tag', tTag);
            tReader.seek(tTagLength);

            break;
        }
      }
    }

    if (tDQT === null) {
      tDQT = pParser.swf.jpegTableDQT;
    }

    if (tDHT === null) {
      tDHT = pParser.swf.jpegTableDHT;
    }

    var tSOF = tSOF0 !== null ? tSOF0 : tSOF2;
    
    pParser.swf.assetManifest.addBuffer(pId + '', Buffer.fromParts([
      [0xFF, 0xD8],
      tAPP0,
      tSOF,
      tDQT,
      tDHT,
      tDRI,
      tSOS
    ]), 'image/jpeg');
  }

  function defineJpegTable(pLength) {
    var tReader = this.r;
    var tDQT = null;
    var tDHT = null;
    var tLastByte = tReader.tell() + pLength;
    var tTag;
    var tLength;
    var tNewDQT;
    var tNewDHT;

    while (tReader.tell() < tLastByte) {
      if (tReader.getUint8() !== 0xFF) {
        quickswf.logger.error('Could not read JPEG Table');

        return;
      }

      tTag = tReader.getUint8();

      if (tTag === 0xD8 || tTag === 0xD9) {
        continue;
      }

      tLength = tReader.getUBits(16);
      tReader.align();

      tReader.seek(-3);

      switch (tTag) {
        case 0xDB: // DQT
          if (tDQT === null) {
            tDQT = tReader.getCopy(tLength + 2);
          } else {
            tNewDQT = Buffer.fromParts([
              tDQT,
              tReader.getCopy(tLength + 2)
            ]);

            tDQT = tNewDQT;
          }
          break;
        case 0xC4: // DHT
          if (tDHT === null) {
            tDHT = tReader.getCopy(tLength + 2);
          } else {
            tNewDHT = Buffer.fromParts([
              tDHT,
              tReader.getCopy(tLength + 2)
            ]);

            tDHT = tNewDHT;
          }
          break;
        default:
          quickswf.logger.warn('Unknown JPEG Table chunk.');
          break;
      }

      tReader.seek(-1);
    }

    this.swf.jpegTableDQT = tDQT;
    this.swf.jpegTableDHT = tDHT;
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  /**
   * @class
   * @extends {benri.content.Blob}
   */
  var Text = (function(pSuper) {
    var MimeType = benri.content.MimeType;
    var Delay = benri.concurrent.Delay;

    /**
     * @constructor
     * @param {string} pText
     * @param {benri.content.MimeType} pType The Mimetype
     */
    function Text(pText, pType) {
      pSuper.call(this, pType || new MimeType('text/plain'));

      this.text = pText;
    }

    Text.fromBuffer = function(pData, pType) {
      var tBlob = new Text('', pType);
      var tDelay = new Delay();

      tBlob.setBuffer(pData, pType.params.charset ? pType.params.charset : 'ascii');

      // TODO: Support streaming this?
      return (new Delay()).resolve(tBlob);
    };

    Text.loadFromURL = function(){}

    var tProto = Text.prototype = Object.create(pSuper.prototype);
    tProto.constructor = Text;

    tProto.setBuffer = function(pBuffer, pEncoding) {
      var tDecoder = new benri.text.Decoder(pEncoding);

      this.text = tDecoder.decode(pBuffer);
    };

    tProto.getBuffer = function(pEncoding) {
      return benri.io.Buffer.fromString(this.text, pEncoding);
    };

    return Text;
  })(benri.content.Blob);

  benri.text.Text = Text;

  benri.content.Blob.register(['text/plain', 'text/*'], function(pEvent) {
    pEvent.add(Text, 10);
  });

}());

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var benri = global.benri;
  var MimeType = benri.content.MimeType;

  /**
   * @class
   * @extends {benri.content.Blob}
   */
  var MediaData = (function(pSuper) {
    /**
     * @constructor
     */
    function MediaData(pType, pData, pMetadata) {
      pSuper.call(this, new MimeType(pType));
      this.data = pData;
      this.metadata = pMetadata;
    }

    MediaData.prototype = Object.create(pSuper.prototype);
    MediaData.prototype.constructor = MediaData;

    /**
     * Returns metadata.
     * @return {object} An object holding metadata.
     */
    MediaData.prototype.getMetaData = function () {
      return this.metadata;
    };

    return MediaData;

  })(benri.content.Blob);

  benri.media.MediaData = MediaData;

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var benri = global.benri;

  /**
   * @class
   * @extends {benri.media.MediaData}
   */
  var AudioData = (function(pSuper) {


    /**
     * A class representing audio data ready for playback.
     * @constructor
     */
    function AudioData(pType, pData, pMetadata) {
      pSuper.call(this, pType, pData, pMetadata);
    }

    AudioData.prototype = Object.create(pSuper.prototype);
    AudioData.prototype.constructor = AudioData;

    return AudioData;

  }(benri.media.MediaData));

  benri.media.audio.AudioData = AudioData;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var EventEmitter = benri.event.EventEmitter;
  var GlobalXMLHttpRequest = global.XMLHttpRequest;
  var Blob = benri.content.Blob;
  var MimeType = benri.content.MimeType;
  var Buffer = benri.io.Buffer;
  var Response = benri.net.Response;
  var Delay = benri.concurrent.Delay;

  benri.impl.add('net.Request', function(pEvent) {
    if (GlobalXMLHttpRequest) {
      pEvent.add(XMLHttpRequestImpl, 11);
    }
  });

  var mPool = [];

  function fromPool() {
    return mPool.pop() || new GlobalXMLHttpRequest();
  }

  function toPool(pXHR) {
    mPool.push(pXHR);
  }

  function getBlobDelay(pXHR) {
    var tResponse;
    var tType = new MimeType(pXHR.getResponseHeader('Content-Type') || 'application/octet-binary');

    if (pXHR._benri_overriden) {
      // This is for old browsers.
      return Blob.fromBuffer(Buffer.fromString(pXHR.responseText), tType);
    }

    tResponse = pXHR.response;

    if (typeof tResponse === 'string') {
      return Blob.fromBuffer(Buffer.fromString(tResponse), tType);
    } else if (tResponse === null) {
      return (new Delay()).reject('Empty Response');
    } else {
      return Blob.fromBuffer(Buffer.fromArray(new Uint8Array(tResponse)), tType);
    }
  }

  function XMLHttpRequestImpl(pRequest) {
    this.request = pRequest;
    this.xhr = null;

    EventEmitter(this);
  }

  XMLHttpRequestImpl.prototype.send = function(pData) {
    var tRequest = this.request;
    var tXHR = this.xhr = fromPool();

    var tHeaders = tRequest.getAllHeaders();
    var tTimeout = tRequest.timeout;

    var tSelf = this;

    function onProgress(pEvent) {
      tSelf.emit('progress', {
        current: pEvent.loaded,
        total: pEvent.lengthComputable ? pEvent.total : -1
      });
    }

    function onLoad(pEvent) {
      var tStatus = this.status;
      var tResponse, tBuffer;

      if (tStatus >= 200 && tStatus < 400) {
        if (tSelf.request.isRaw) {
          tResponse = tXHR.response;

          if (tResponse === null) {
            tSelf.emit('error', {
              type: 'error',
              status: tXHR.status,
              message: 'Empty response'
            });

            return;
          }

          if (typeof tResponse === 'string') {
            tBuffer = Buffer.fromString(tResponse);
          } else {
            tBuffer = Buffer.fromArray(new Uint8Array(tResponse));
          }

          tSelf.emit('load', {
            response: new Response(
              tStatus,
              this.statusText,
              tXHR.getAllResponseHeaders(),
              tBuffer
            )
          });
        } else {
        getBlobDelay(tXHR).then(
            function(pBlob) {
              tSelf.emit('load', {
                response: new Response(
                  tStatus,
                  this.statusText,
                  tXHR.getAllResponseHeaders(),
                  pBlob
                )
              });
            },
            function(pReason) {
              tSelf.emit('error', {
                type: 'error',
                status: tXHR.status,
                message: pReason
              });
            }
          );
        }
      } else {
        tSelf.emit('error', {
          type: 'http',
          status: tStatus,
          message: this.statusText
        });
      }
    }

    function onError(pEvent) {
      tSelf.emit('error', {
        type: 'error',
        status: tXHR.status,
        message: tXHR.statusText || 'Unknown'
      });
    }

    function onAbort(pEvent) {
      tSelf.emit('error', {
        type: 'abort',
        status: 0,
        message: 'Aborted'
      });
    }

    function onTimeout(pEvent) {
      tSelf.emit('error', {
        type: 'timeout',
        status: 0,
        message: 'Timeout'
      });
    }

    function onLoadEnd() {
      tXHR.removeEventListener('progress', onProgress, false);
      tXHR.removeEventListener('error', onError, false);
      tXHR.removeEventListener('load', onLoad, false);
      tXHR.removeEventListener('abort', onAbort, false);
      tXHR.removeEventListener('timeout', onTimeout, false);
      tXHR.removeEventListener('loadend', onLoadEnd, false);

      tSelf.xhr = null;
      tXHR._benri_overriden = false;

      toPool(tXHR);

      tXHR = null;
    }

    tXHR.addEventListener('progress', onProgress, false);
    tXHR.addEventListener('error', onError, false);
    tXHR.addEventListener('load', onLoad, false);
    tXHR.addEventListener('abort', onAbort, false);
    tXHR.addEventListener('timeout', onTimeout, false);
    tXHR.addEventListener('loadend', onLoadEnd, false);

    tXHR.timeout = tTimeout;

    tXHR.open(tRequest.method, tRequest.url.toString(), true);

    for (var k in tHeaders) {
      tXHR.setRequestHeader(k, tHeaders[k]);
    }

    if (tRequest.isRaw) {
      if ('responseType' in tXHR) {
        tXHR.responseType = 'arraybuffer';
      } else {
        tXHR.overrideMimeType('text/plain;charset=x-user-defined');
        tXHR._benri_overriden = true;
      }
    }

    tXHR.send(pData);
  };

  XMLHttpRequestImpl.prototype.abort = function() {
    if (this.xhr !== null) {
      this.xhr.abort();
    }
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  if (!('HTMLAudioElement' in global)) {
    return;
  }

  var benri = global.benri;
  var Delay = benri.concurrent.Delay;
  var Blob = benri.impl.web.Blob;
  var createObjectURL = benri.impl.web.createObjectURL;
  var revokeObjectURL = benri.impl.web.revokeObjectURL;

  /**
   * @class
   * @extends {benri.media.audio.AudioData}
   */
  var HTMLAudio = (function(pSuper) {

    /**
     * A class representing audio data ready for playback.
     * @constructor
     */
    function HTMLAudio(pData) {
      pSuper.call(this, 'audio/*', pData);
    }

    HTMLAudio.prototype = Object.create(pSuper.prototype);
    HTMLAudio.prototype.constructor = HTMLAudio;

    return HTMLAudio;

  }(benri.media.audio.AudioData));

  HTMLAudio.fromBuffer = function(pData, pType) {
    var tDelay = new Delay();
    var tType = pType.toString();
    var tBlob = new Blob([pData.data], {type: tType});
    var tURL = createObjectURL(tBlob);

    var tAudio = new global.Audio();
    tAudio.src = tURL;

    tAudio.addEventListener('loadeddata', function() {
      revokeObjectURL(tURL);
      tDelay.resolve(new HTMLAudio(tAudio));
    }, false);

    tAudio.addEventListener('error', function(e) {
      revokeObjectURL(tURL);
      tDelay.reject(e);
    }, false);

    tAudio.load();

    return tDelay;
  };

  benri.content.Blob.register('audio/*', function(pEvent) {
    pEvent.add(HTMLAudio, 11);
  });

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  /**
   * @class
   * @extends {benri.content.Blob}
   */
  var Image = (function(pSuper) {
    var MimeType = benri.content.MimeType;
    var Blob = benri.content.Blob;
    var Delay = benri.concurrent.Delay;

    var mWildImageMimeType = new MimeType('image/*');

    /**
     * @constructor
     * @param {benri.content.MimeType} pType The Mimetype
     */
    function Image(pWidth, pHeight) {
      pSuper.call(this, new MimeType('image/*'));

      this._width = pWidth;
      this._height = pHeight;
    }

    Image.create = function(pWidth, pHeight) {
      return (new Blob.getClass(mWildImageMimeType))(pWidth, pHeight);
    };

    Image.fromBuffer = function(pData, pType) {
      return (new Delay()).reject('Not implemented');
    };

    var tProto = Image.prototype = Object.create(pSuper.prototype);
    tProto.constructor = Image;

    tProto.setBuffer = function(pBuffer) {
      
    };

    tProto.getBuffer = function() {
      
    };

    tProto.getBytes = function(pX, pY, pWidth, pHeight, pStride) {

    };

    tProto.setBytes = function(pBytes, pX, pY, pWidth, pHeight, pStride) {

    };

    tProto.getWidth = function() {
      return this._width;
    };

    tProto.getHeight = function() {
      return this._height;
    };

    return Image;
  })(benri.content.Blob);

  benri.graphics.Image = Image;

  benri.content.Blob.register('image/*', function(pEvent) {
    pEvent.add(Image, 5);
  });

}());

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  if (!('HTMLCanvasElement' in global)) {
    return;
  }

  var mem = benri.mem;
  var Delay = benri.concurrent.Delay;

  var mInstancePoolEnabled = true;
  var mLRUPoolEnabled = true;
  var ANTIALIAS = 'benri.graphics.surface.antialias';

  var mAntialias = benri.env.getVar(ANTIALIAS) || false;

  benri.env.on('setvar', function(pEvent) {
    if (pEvent.varName === ANTIALIAS) {
      mAntialias = pEvent.varValue;
    }
  });

  var TYPE_IMAGE = 0x1;
  var TYPE_CANVAS = 0x2;
  var TYPE_VIDEO = 0x3;

  var mHaveUint8ClampedArray = 'Uint8ClampedArray' in global;

  /**
   * @class
   * @extends {benri.graphics.Image}
   */
  var DOMImage = (function(pSuper) {

    /**
     * @constructor
     */
    function DOMImage(pWidth, pHeight, pImage) {
      if (!pWidth) {
        pWidth = 1;
      }

      if (!pHeight) {
        pHeight = 1;
      }

      if (!pImage) {
        pImage = _createHTMLCanvas(pWidth, pHeight);
      }

      if (pImage instanceof global.HTMLImageElement) {
        this._domType = TYPE_IMAGE;
      } else if (pImage instanceof global.HTMLCanvasElement) {
        this._domType = TYPE_CANVAS;
      } else if (pImage instanceof global.HTMLVideoElement) {
        this._domType = TYPE_VIDEO;
      } else {
        throw new Error('Invalid DOMImage');
      }

      pSuper.call(this, pWidth, pHeight);

      this.domImage = pImage;

      this.on('destroy', function () {
        this.recycle && this.recycle();
      });

      this._preAllocatedImage = null;
      this._preAllocatedType = -1;
    }

    DOMImage.fromImage = function(pImage) {
      var tWidth = pImage.getWidth();
      var tHeight = pImage.getHeight();
      var tImage = new DOMImage(tWidth, tHeight, void 0);

      tImage.setBytes(
        pImage.getBytes(0, 0, tWidth, tHeight, tWidth),
        0, 0, tWidth, tHeight, tWidth
      );

      return tImage;
    };

    var tProto = DOMImage.prototype = Object.create(pSuper.prototype);
    tProto.constructor = DOMImage;

    tProto.getType = function() {
      return this._domType;
    };

    tProto.getBytes = function(pX, pY, pWidth, pHeight, pStride) {
      var tDOMImage = this.domImage;
      var tImageData;
      var tBytes;

      if (!pX) {
        pX = 0;
      }

      if (!pY) {
        pY = 0;
      }

      if (!pWidth) {
        pWidth = this.getWidth();
      }

      if (!pHeight) {
        pHeight = this.getHeight();
      }

      if (this._domType === TYPE_CANVAS) {
        tImageData = tDOMImage.getContext('2d').getImageData(pX, pY, pWidth, pHeight);
        tBytes = tImageData.data;
        tBytes._domImageData = tImageData;

        return tBytes;
      } else {
        var tCanvas = _createHTMLCanvas(pWidth, pHeight);
        _resetHTMLCanvas(tCanvas);
        var tContext = tCanvas.getContext('2d');
        tContext.drawImage(tDOMImage, 0, 0, pWidth, pHeight, 0, 0, pWidth, pHeight);
        tImageData = tContext.getImageData(pX, pY, pWidth, pHeight);

        tBytes = tImageData.data;
        tBytes._domImageData = tImageData;

        return tBytes;
      }
    };

    tProto.setBytes = function(pBytes, pX, pY, pWidth, pHeight, pStride) {
      var tContext;
      var tImageData = pBytes._domImageData;
      var tDOMImage = this.domImage;
      var tThisWidth = tDOMImage.width;
      var tThisHeight = tDOMImage.height;
      var tCanvas;

      if (this._domType !== TYPE_CANVAS) {
        tCanvas = _createHTMLCanvas(tThisWidth, tThisHeight);
        _resetHTMLCanvas(tCanvas);

        tContext = tCanvas.getContext('2d');
        
        if (pX !== 0 || pY !== 0 || tThisWidth !== tDOMImage.width || tThisHeight !== tDOMImage.height) {
          tContext.drawImage(tDOMImage, 0, 0, tThisWidth, tThisHeight, 0, 0, tThisWidth, tThisHeight);
        }

        this.domImage = tCanvas;
        this._domType = TYPE_CANVAS;
      } else {
        tCanvas = tDOMImage;
        tContext = tCanvas.getContext('2d');
      }

      if (tImageData && tImageData.width === pWidth && tImageData.height === pHeight) {
        tContext.putImageData(tImageData, pX, pY);
      } else {
        tImageData = tContext.getImageData(pX, pY, pWidth, pHeight);
        var tRawData = tImageData.data;

        if (mHaveUint8ClampedArray === true && tRawData instanceof Uint8ClampedArray) {
          tRawData.set(pBytes);
        } else {
          for (var i = 0, il = pBytes.length; i < il; i++) {
            tRawData[i] = pBytes[i];
          }
        }

        tContext.putImageData(tImageData, pX, pY);
      }
    };

    tProto.setBuffer = function(pBuffer, pType) {
      
    };

    tProto.getBuffer = function() {
      return null;
    };

    return DOMImage;
  })(benri.graphics.Image);

  benri.impl.web.graphics.DOMImage = DOMImage;

  var Blob = benri.impl.web.Blob;
  var createObjectURL = benri.impl.web.createObjectURL;
  var revokeObjectURL = benri.impl.web.revokeObjectURL;

  DOMImage.fromBuffer = function(pBuffer, pType) {
    var tDelay = new Delay();
    
    var tBlob = new Blob([pBuffer.data], {type: pType.toString()});
    var tURL = createObjectURL(tBlob);

    var tImage = new global.Image();
    tImage.src = tURL;

    tImage.onload = function() {
      revokeObjectURL(tURL);
      tDelay.resolve(new DOMImage(this.width, this.height, this));
    };

    tImage.onerror = function(e) {
      revokeObjectURL(tURL);
      tDelay.reject(e);
    }

    return tDelay;
  };

  benri.content.Blob.register('image/*', function(pEvent) {
    pEvent.add(DOMImage, 11);
  });


  function _createHTMLCanvas(pWidth, pHeight) {
    var tCanvas = document.createElement('canvas');
    tCanvas.width = Math.ceil(pWidth);
    tCanvas.height = Math.ceil(pHeight);
    tCanvas.style.webkitTransform = 'translateZ(0)';

    var tContext = tCanvas.getContext('2d');

    if (tContext.webkitImageSmoothingEnabled !== mAntialias) {
      tContext.webkitImageSmoothingEnabled = mAntialias;
    }

    return tCanvas;
  };

  function _resetHTMLCanvas(pCanvas) {
    var tContext = pCanvas.getContext('2d');
    tContext.setTransform(1, 0, 0, 1, 0, 0);
    tContext.globalCompositeOperation = 'source-over';
    tContext.globalAlpha = 1;
    tContext.clearRect(0, 0, pCanvas.width + 1, pCanvas.height + 1);
    return pCanvas;
  };

  if (mInstancePoolEnabled) {

    var KEY_BASE = 1.38;
    var LOG_KEY_BASE = Math.log(KEY_BASE);
    var mTotalAllocNum = 0;
    var mPoolTimeLimit = 100000;
    var mInitialAllocNum = 1;

    // TODO: Need to find out the universally applicable numbers.
    var mAllocNums = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ];

    var mAllocSizes = new Array(mAllocNums.length);
    for (var i = 0, il = mAllocSizes.length; i < il; i++) {
      mAllocSizes[i] = Math.ceil(Math.pow(KEY_BASE, i));
    }

    var mRefill = function (pPool, pPoolIndex) {
      var tPool = pPool.data;
      if (!tPool) {
        tPool = pPool.data = [];
      }
      var tWaterLevel = pPool.waterLevel;
      if (!tWaterLevel) {
        tWaterLevel = pPool.waterLevel = [];
      }
      var tCrudeSum = 0;
      var tAlloc = function (pIndex, pAllocNum) {
        var tSize = mAllocSizes[pIndex];
        var tPoolLane = tPool[pIndex], tInstance, tInstanceData;

        if (tPoolLane === void 0) {
          tPoolLane = tPool[pIndex] = [];
        }
//if (pAllocNum - tPoolLane.length > 0) {
//console.log('Alloc: index [' + pIndex + '] num=' + (pAllocNum - tPoolLane.length));
//}
        for (var i = tPoolLane.length; i < pAllocNum; i++) {
          tInstance = new DOMImage(tSize, tSize, void 0);
          tInstanceData = tInstance.__instanceData = {};
          tInstanceData.lastRecycled = new Date();
          tPoolLane.push(tInstance);
          mTotalAllocNum++;
          tCrudeSum += tSize;
        }
        // Set up a water level, an array to keep track of how many instances are used at a given time.
        // waterLevel[i][0] : holds the number of the instances currently allocated from the i-th pool.
        // waterLevel[i][1] : holds the peak number of the instances allocated from the i-th pool.
        if (!tWaterLevel[pIndex]) {
          tWaterLevel[pIndex] = [0, 0];
        }
      };


      for (var i = 0, il = mAllocNums.length; i < il; i++) {
        var tValue = mAllocNums[i];
        if (tValue) {
          tAlloc(i, tValue);
        }
      }

      if (pPoolIndex !== void 0) {
        var tLane = tPool[pPoolIndex];
        if (!tLane || tLane.length === 0) {
          if (mAllocSizes[pPoolIndex] === void 0) {
            mAllocSizes[pPoolIndex] = Math.ceil(Math.pow(KEY_BASE, pPoolIndex));
          }
          tAlloc(pPoolIndex, mInitialAllocNum);
          //if (mAllocNums[tPoolIndex] === void 0) {
          //  mAllocNums[tPoolIndex] = mInitialAllocNum;
          //}
        }
      }
//if (mPool._statisticsReportCallback) {
//  console.log('Refilled!!!');
//  mPool._statisticsReportCallback(pPool);
//}
      return tCrudeSum;
    };

    var mObtain = function (pPool, pArgs) {
      var tPool = pPool.data;
      var tWaterLevel = pPool.waterLevel;
      var tWidth = pArgs[0];
      var tHeight = pArgs[1];
      var tImage = pArgs[2];

      // Never refilled.
      if (!tPool) {
        return null;
      }

      // Determine the pool index.
      var tPoolIndex = Math.ceil(
        Math.log(Math.max(tWidth, tHeight)) / LOG_KEY_BASE
      );

      // Make a room for the pool index.
      var tPoolLane = tPool[tPoolIndex];
      if (!tPoolLane) {
        tPoolLane = tPool[tPoolIndex] = [];
      }

      // Allocate the instance from the pool.
      tInstance = tPoolLane.pop();

      // Pool gets empty.
      if (!tInstance) {
        mRefill(pPool, tPoolIndex);
        tInstance = tPoolLane.pop();
      }

      if (!tInstance) {
        return null;
      }

      // Initialize the instance
      if (!tWidth) {
        tWidth = 1;
      }
      if (!tHeight) {
        tHeight = 1;
      }
      tInstance._width = tWidth;
      tInstance._height = tHeight;

      // Update the preallocated image if exists.
      if (tImage) {
        tInstance._preAllocatedImage = tInstance.domImage;
        tInstance._preAllocatedImageType = tInstance._domType;
        tInstance.domImage = tImage;
        if (tImage instanceof global.HTMLImageElement) {
          tInstance._domType = TYPE_IMAGE;
        } else if (tImage instanceof global.HTMLCanvasElement) {
          tInstance._domType = TYPE_CANVAS;
        } else if (tImage instanceof global.HTMLVideoElement) {
          tInstance._domType = TYPE_VIDEO;
        } else {
          throw new Error('Invalid DOMImage');
        }
      } else {
        if (tInstance._domType === TYPE_CANVAS) {
          _resetHTMLCanvas(tInstance.domImage);
        }
      }

      // Update the water level.
      var tItem = tWaterLevel[tPoolIndex];
      if (!tItem) {
        tItem = tWaterLevel[tPoolIndex] = [0, 0];
      }
      tItem[0]++; // Current number of the used instances.
      tItem[1] = Math.max(tItem[1], tItem[0]); // Records the peak number.

      // Attach the instance specific info.
      var tInstanceData = tInstance.__instanceData;
      tInstanceData.poolIndex = tPoolIndex;
      tInstanceData.lastObtained = new Date();

      return tInstance;
    };

    var mRecycle = function (pPool, pInstance) {
      var tPool = pPool.data;

      // Never refilled.
      if (!tPool) {
        return;
      }

      var tWaterLevel = pPool.waterLevel;
      var tInstanceData = pInstance.__instanceData;

      // Restore some properties.
      mem.Keeper(pInstance);
      pInstance.onFor('destroy', function () {
        pInstance.recycle && pInstance.recycle();
      }, 1);

      // Update the preallocated image if exists.
      if (pInstance._preAllocatedImage) {
        pInstance.domImage = pInstace._preAllocatedImage;
        pInstance._domImageType = pInstace._preAllocatedImageType;
        delete pInstace._preAllocatedImage;
        delete pInstace._preAllocatedImageType;
      }

      if (!tInstanceData) {
        // Instances allocated outside the pool.
        return;
      }

      // Update the water level.
      if (tWaterLevel) {
        tWaterLevel[tInstanceData.poolIndex][0]--;
      }

      // Put the instance back to the pool.
      tPool[tInstanceData.poolIndex].push(pInstance);

      // Attach the instance specific data.
      tInstanceData.lastRecycled = new Date();
    };

    var mCleanup = function (pPool) {
      var tPool = pPool.data;

      // Never refilled.
      if (!tPool) {
        return 0;
      }
      var tThreshold = Date.now() - mPoolTimeLimit;
      var tCrudeSum = 0;

      for (var i = 0, il = tPool.length; i < il; i++) {
        var tPoolLane = tPool[i];
        if (!tPoolLane) {
          mAllocNums[i] = 0;
          continue;
        }
        for (var j = tPoolLane.length; j--;) {
          var tInstance = tPoolLane[j];
          var tInstanceData = tInstance.__instanceData;
          if (!tInstanceData ||
            tInstanceData.lastRecycled.getTime() < tThreshold) {
            tPoolLane.splice(j, 1);
            mTotalAllocNum--;
            tCrudeSum += tInstance._width;
          }
        }
        //mAllocNums[i] = tPoolLane.length;
      }
//if (mPool._statisticsReportCallback) {
//  console.log('CleanUp!!!');
//  mPool._statisticsReportCallback(pPool);
//}
      return tCrudeSum;
    };

    var mReport = function (pPool) {
      var tPool = pPool.data;

      // Never refilled.
      if (!tPool) {
        return;
      }

      var tWaterLevel = pPool.waterLevel;
      var i, il, n;

      // Copy the information about the unused instances.
      var tUnusedInstanceNum = 0;
      for (i = 0, il = tPool.length; i < il; i++) {
        if (tPool[i]) {
          tUnusedInstanceNum += tPool[i].length;
        }
      }

      // Copy the information about the currently used instances.
      var tPeakWaterLevel = 0, tPeakWaterLevelPerId = new Array(il);
      for (i = 0; i < il; i++) {
        if (tWaterLevel[i]) {
          n = tPeakWaterLevelPerId[i] = tWaterLevel[i][1];
          tPeakWaterLevel += n;
        }
      }

      console.log(
        JSON.stringify({
          'type' : 'DOMImage',
          'total number of objects in this pool' : mTotalAllocNum,
          'currentlly used' : (mTotalAllocNum - tUnusedInstanceNum),
          'currentlly unused' : tUnusedInstanceNum,
          'peak' : tPeakWaterLevel,
          'peak (per id)' : tPeakWaterLevelPerId
        }, null, 2)
      );
    };

    var mPool = new mem.InstancePool({
      refill : mRefill,
      obtain : mObtain,
      recycle : mRecycle,
      name : 'DOMImage',
      supervisor : mem.getDefaultNativeSupervisor(),
      tag : 'image',
      cleanUpCallback : mCleanup,
      statisticsReportCallback : mReport,
      autoCleanUp : true,
      lazyAlloc : true
    });


    // Wraps the pool's methods around DOMImage type.
    DOMImage.obtain = function (pWidth, pHeight, pImage) {
      return mPool.obtain([pWidth, pHeight, pImage]);
    };

    DOMImage.prototype.recycle = function () {
      mPool.recycle(this);
    };

  } else {

    DOMImage.obtain = function (pWidth, pHeight, pImage) {
      return new DOMImage(pWidth, pHeight, pImage);
    };

    DOMImage.recycle = function () {
      ;
    };
  }

  if (mLRUPoolEnabled) {
    var MAX_SIZE = 10;

    var mIndexGenerator = function (pArgs) {
      var tWidth = pArgs[0];
      var tHeight = pArgs[1];

      return tWidth + ',' + tHeight;
    };

    var mCreate = function (pArgs) {
      var tWidth = pArgs[0];
      var tHeight = pArgs[1];

      return new DOMImage(tWidth, tHeight, void 0);
    };

    var mReset = function (pInstance) {
      _resetHTMLCanvas(pInstance.domImage);
    };

    var mDestroy = function (pInstance) {
      pInstance.destroy();
    };

    var mLRUPool = new mem.LRUPool({
      maxLength : MAX_SIZE,
      indexGenerator : mIndexGenerator,
      create : mCreate,
      reset : mReset,
      destroy : mDestroy
    });
    

    DOMImage.obtainFromLRUPool = function (pWidth, pHeight) {
      return mLRUPool.obtain([pWidth, pHeight]);
    };


  } else {
    DOMImage.obtainFromLRUPool = function (pWidth, pHeight) {
      return new DOMImage(pWidth, pHeight, void 0);
    };
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;

  /**
   * @class
   * @extends {benri.graphics.Image}
   */
  var Texture = (function(pSuper) {
    /**
     * @constructor
     * @param {[type]} pSurface
     */
    function Texture(pSurface, pWidth, pHeight, pImage) {
      pSuper.call(this, pWidth, pHeight);

      this.id = -1;

      this.surface = pSurface;

      pSurface.registerTexture(this);
      this.setImage(pImage);

      this.on('destroy', onDestroy);
    }

    Texture.prototype = Object.create(pSuper.prototype);
    Texture.prototype.constructor = Texture;

    Texture.prototype.getBytes = function(pX, pY, pWidth, pHeight, pStride) {
      return this.surface.getTextureBytes(this, pX, pY, pWidth, pHeight, pStride);
    };

    Texture.prototype.setBytes = function(pBytes, pX, pY, pWidth, pHeight, pStride) {
      this.surface.setTextureBytes(this, pBytes, pX, pY, pWidth, pHeight, pStride);
    };

    /**
     * Sets the backing Image of this texture.
     * As a rule, once you set an Image to a Texture,
     * the passed Image's getBytes and setBytes results
     * will become undefined and should never be used.
     * This is to allow cross platform methods of handling
     * what exactly a texture is and how it deals with
     * the backing Image.
     * @param {benri.graphics.draw.AbstractImage} pImage
     */
    Texture.prototype.setImage = function(pImage) {
      this.surface.setTextureImage(this, pImage);
    };
  
    function onDestroy(pData, pTarget) {
      pTarget.surface.destroyTexture(pTarget);
    }

    return Texture;
  })(benri.graphics.Image);

  benri.graphics.render.Texture = Texture;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  if (!global.HTMLCanvasElement) {
    return;
  }

  /**
   * @class
   * @extends {benri.graphics.Surface}
   */
  var Canvas2DSurface = (function(pSuper) {
    var DOMImage = benri.impl.web.graphics.DOMImage;
    var Matrix2D = benri.geometry.Matrix2D;
    var Records = benri.graphics.Records;
    var Shader = benri.graphics.shader.Shader;
    var Texture = benri.graphics.render.Texture;
    var flag = benri.graphics.Surface.flag;

    var mFragmentShaders = benri.impl.web.graphics.shader.fragment;

    /**
     * @constructor
     */
    function Canvas2DSurface(pWidth, pHeight, pHints) {
      pSuper.call(this, pWidth, pHeight, pHints);

      var tFlags = this._flags = [];

      tFlags[flag.ANTIALIAS] = false;
      this._fragments = tFlags[flag.FRAGMENTS] = true;
      this._stencilTest = tFlags[flag.STENCIL_TEST] = false;

      this.textures = [];

      var tTarget = this.canvasTarget = createCanvasTarget(this, pWidth, pHeight, this.hints.recycle, null);
      this.canvas = tTarget.canvas;
      this.context = tTarget.context;

      /**
       * An array of currently existing targets.
       * @private
       * @type {Target}
       */
      this._targets = [tTarget];

      this._targetStatus = [{
        identityTransform: true
      }];

      this._targetStatusStack = [[]];
      
      this._activeTarget = 0;

      this._compositeCanvasStack = [];

      this.colors = null;
    }
  
    var tProto = Canvas2DSurface.prototype = Object.create(pSuper.prototype);
    tProto.constructor = Canvas2DSurface;

    tProto.updateUniforms = function(pProgram) {
      var tMatrix = pProgram.matrix;

      this.setTransform(
        tMatrix.a,
        tMatrix.b,
        tMatrix.c,
        tMatrix.d,
        tMatrix.e,
        tMatrix.f
      );
    };

    tProto.saveContext = function () {
      var tId = this._activeTarget;
      var tCurrentStatus = this._targetStatus[tId];

      this._targetStatusStack[tId].push({
        identityTransform: tCurrentStatus.identityTransform
      });

      this.context.save();
    };

    tProto.restoreContext = function () {
      var tId = this._activeTarget;

      this._targetStatus[tId] = this._targetStatusStack[tId].pop();
      
      this.context.restore();
    };

    tProto.setIdentityTransform = function () {
      var tId = this._activeTarget;
      var tStatus = this._targetStatus[tId];

      if (tStatus.identityTransform) {
        return;
      }

      this.context.setTransform(1, 0, 0, 1, 0, 0);
      tStatus.identityTransform = true;
    };

    tProto.setTransform = function (pA, pB, pC, pD, pE, pF) {
      this.context.setTransform(pA, pB, pC, pD, pE, pF);

      this._targetStatus[this._activeTarget].identityTransform = false;
    };

    tProto.transform = function (pA, pB, pC, pD, pE, pF) {
      this.context.transform(pA, pB, pC, pD, pE, pF);

      this._targetStatus[this._activeTarget].identityTransform = false;
    };

    tProto.getImageDOMElement = function(pImage) {
      var tConstructor = pImage.constructor;

      if (tConstructor === Texture) {
        return this.textures[pImage.id].image.domImage;
      } else if (tConstructor === DOMImage) {
        return pImage.domImage;
      } else {
        return DOMImage.fromImage(pImage).domImage;
      }
    };

    tProto.enable = function(pFlag) {
      this._flags[pFlag] = true;

      if (pFlag === flag.STENCIL_TEST) {
        this._stencilTest = true;
      } else if (pFlag === flag.FRAGMENTS) {
        this._fragments = true;
      } else if (pFlag === flag.STENCIL_SAVE) {
        this.saveContext();
      }
    };

    tProto.disable = function(pFlag) {
      this._flags[pFlag] = false;

      if (pFlag === flag.STENCIL_TEST) {
        this._stencilTest = false;
      } else if (pFlag === flag.FRAGMENTS) {
        this._fragments = false;
      } else if (pFlag === flag.STENCIL_SAVE) {
        this.restoreContext();
      }
    };

    tProto.isEnabled = function(pFlag) {
      return this._flags[pFlag] || false;
    };
 
    tProto.image = function(pImage, pWidth, pHeight, pSrcRect, pProgram) {
      this.render(
        null,
        Records.RAW,
        {
          image: this.getImageDOMElement(pImage),
          width: pWidth,
          height: pHeight,
          srcX: pSrcRect.origin.x,
          srcY: pSrcRect.origin.y,
          srcWidth: pSrcRect.getWidth(),
          srcHeight: pSrcRect.getHeight()
        },
        pProgram
      );
    };

    tProto.fastImage = function(pImage, pProgram) {
      var tWidth = pImage.getWidth();
      var tHeight = pImage.getHeight();

      this.render(
        null,
        Records.RAW,
        {
          image: this.getImageDOMElement(pImage),
          width: tWidth,
          height: tHeight,
          srcX: 0,
          srcY: 0,
          srcWidth: tWidth,
          srcHeight: tHeight
        },
        pProgram
      );
    };

    tProto.text = function(pText, pStyle, pProgram) {
      this.updateUniforms(pProgram);

      pProgram.fillType = Records.TEXT;
      pProgram.fillTypeText = 'fillStyle';
      pProgram.fillData = null;
      pProgram.colors = [pStyle.color];

      var tFont = pStyle.font;
      var tContext = this.context;
      var tLeading = tFont.leading * pStyle.fontHeight / 1024;
      var tStringList, tString = pText + '';
      var tFontString = (tFont.italic ? 'italic ' : '') + (tFont.bold ? 'bold ' : '') + pStyle.fontHeight + 'px ' + tFont.name;
      var tYPos = 0, tWidth = pStyle.maxWidth;
      var tXPos = pStyle.leftMargin + (pStyle.align === 'left' ? 0 : (pStyle.align === 'center' ? tWidth / 2 : tWidth));
      var i, il;

      // CnvasRenderingContext2D.fillText() forcibly converts all the spaces into ASCII spaces.
      // However, the space characters are sometimes used for making visual space.
      // So, here we do such the conversion more precise way so that we can preserve the original layout.
      tContext.font = tFontString;

      var tSpaceWidth = tContext.measureText('\u0020').width;
      var tIdeographicSpaceWidth = tContext.measureText('\u3000').width;
      var tSpaceMultRate = (tSpaceWidth && tIdeographicSpaceWidth ? tIdeographicSpaceWidth / tSpaceWidth : 4);

      // This function takes an arbitrary number of the ideographic spaces (U+3000,)
      // and returns how many ASCII spaces (U+0020) are needed for filling the same on-screen area
      // that the ideographic spaces would have ocupied.
      var howManySpaces = function (pString) {
        return Math.round(pString.length * tSpaceMultRate);
      };

      tString = tString.replace(/\u3000+/g, function (pMatched) {
        // Generating sucessive SPACE characters.
        return Array(howManySpaces(pMatched) + 1).join('\u0020');
      });

      // Fold the text.
      var tCharCode, tStringTarget = '';
      tStringList = [];

      for (i = 0, il = tString.length; i < il; i++) {
        tCharCode = tString.charCodeAt(i);

        // We take account of line breaks even when TextStyle.multiline is true.
        if (tCharCode === 10 || tCharCode === 13) {
          tStringList.push(tStringTarget);
          tStringTarget = '';
          continue;
        }

        tStringTarget += tString[i];

        if (i === il - 1
          || (pStyle.multiline
              && tContext.measureText(tStringTarget + tString[i + 1]).width > tWidth)) {
          tStringList.push(tStringTarget);
          tStringTarget = '';
        }
      }

      var tShaders = pProgram.getShaders(Shader.TYPE_FRAGMENT);
      var tShader;
      var tShaderImpl;
      var i;
      var tShadersLength = tShaders.length;

      for (i = 0; i < tShadersLength; i++) {
        tShader = tShaders[i];
        mFragmentShaders[tShader.name].pre(tShader, this, pProgram);
      }

      for (i = 0; i < tShadersLength; i++) {
        tShader = tShaders[i];
        tShaderImpl = mFragmentShaders[tShader.name];

        if (tShaderImpl.style) {
          tShaderImpl.style(tShader, this, pProgram);
        }
      }

      tContext.textBaseline = 'top';
      tContext.textAlign = pStyle.align;

      for (i = 0, il = tStringList.length; i < il; i++) {
        tString = tStringList[i];
        tContext.fillText(tString, tXPos, tYPos);
        tYPos += (tLeading + pStyle.fontHeight);
      }

      this.setTargetFresh(false);

      for (i = 0; i < tShadersLength; i++) {
        tShader = tShaders[i];
        mFragmentShaders[tShader.name].post(tShader, this, pProgram);
      }

      this.setIdentityTransform();
    };

    tProto.clearColor = function(pColor) {
      var tWidth = this.width;
      var tHeight = this.height;
      var tContext = this.context;
      var tAlpha = pColor.getRGBA()[3];

      this.saveContext();
      this.setIdentityTransform();

      if (tAlpha !== 0xFF) {
        // Only clear if we are clearing transparent
        // for performance.
        // Also, we have an amazing hack here to support
        // Samsung Galaxy S devices as well as a couple
        // other devices. If you do not scale this,
        // the first pixel of the next fill will override
        // all other drawing operations and only that one
        // pixel will show over the canvas... yeah...
        // The +1 is for some random devices bugging out if
        // you clear the buffer at exact dimensions.
        
        tContext.scale(1, 1);
        tContext.clearRect(0, 0, tWidth + 1, tHeight + 1);
        this.setTargetFresh(true);
      }

      if (tAlpha !== 0) {
        tContext.fillStyle = pColor.toCSSString();
        tContext.fillRect(0, 0, tWidth, tHeight);
        this.setTargetFresh(false);
      }

      this.restoreContext();
    };

    function sizzorTestLocationVerticies(pVerticies, pOffsetX, pOffsetY, pWidth, pHeight) {
      var tVertex;
      var tX, tY;

      var tMinX = 2147483647;
      var tMinY = 2147483647;
      var tMaxX = -2147483648;
      var tMaxY = -2147483648;

      for (var i = 0, il = pVerticies.length; i < il; i++) {
        tVertex = pVerticies[i];
        tX = tVertex[0];
        tY = tVertex[1];

        // Chances are this first two if statements
        // will return true right away so we do them
        // first.
        if (tX > pOffsetX && tX < pWidth && tY > pOffsetY && tY < pHeight) {
          return true;
        }

        if (tX < tMinX) {
          tMinX = tX;
        }

        if (tX > tMaxX) {
          tMaxX = tX;
        }

        if (tY < tMinY) {
          tMinY = tY;
        }

        if (tY > tMaxY) {
          tMaxY = tY;
        }
      }

      if (
          tMaxX <= 0 || tMinX >= pWidth ||
          tMaxY <= 0 || tMinY >= pHeight
        ) {
        return false;
      }

      return true;
    }

    function sizzorTestPolygonVerticies(pVerticies, pOffsetX, pOffsetY, pWidth, pHeight) {
      var tX, tY;

      var tMinX = 2147483647;
      var tMinY = 2147483647;
      var tMaxX = -2147483648;
      var tMaxY = -2147483648;

      for (var i = 0, il = pVerticies.length; i < il; i += 2) {
        tX = pVerticies[i];
        tY = pVerticies[i + 1];

        // Chances are this first two if statements
        // will return true right away so we do them
        // first.
        if (tX > pOffsetX && tX < pWidth && tY > pOffsetY && tY < pHeight) {
          return true;
        }

        if (tX < tMinX) {
          tMinX = tX;
        }

        if (tX > tMaxX) {
          tMaxX = tX;
        }

        if (tY < tMinY) {
          tMinY = tY;
        }

        if (tY > tMaxY) {
          tMaxY = tY;
        }
      }

      if (
          tMaxX <= 0 || tMinX >= pWidth ||
          tMaxY <= 0 || tMinY >= pHeight
        ) {
        return false;
      }

      return true;
    }

    var mRawSizzorPolygon = new benri.geometry.Polygon([
      0, 0,
      0, 0,
      0, 0,
      0, 0
    ]);

    tProto.render = function(pVerticies, pFillType, pFillData, pProgram) {
      var tFragments = this._fragments;

      if (pVerticies) {
        this.setIdentityTransform();

        var tFinalLocationData = this.specifyVerticies(
          pVerticies,
          pProgram
        );

        if (
            !this._stencilTest &&
            sizzorTestLocationVerticies(
              tFinalLocationData,
              0,
              0,
              this.canvas.width,
              this.canvas.height
            ) === false
          ) {
          // Don't render stuff we can't see.
          return;
        }

        var tVertexBuffer = pVerticies.buffer;

        // tessellate the verticies making primitives.
        this.tessellate(
          pVerticies.type,
          tFinalLocationData, // A new array of vertex locations
          tVertexBuffer.locationSize,
          tVertexBuffer.attributes,
          pProgram
        );
      } else {
        if (!tFragments && this._stencilTest) {
          if (pFillType === Records.RAW) {
            this.updateUniforms(pProgram);
            this.context.rect(0, 0, pFillData.width, pFillData.height);
          } else {
            this.setIdentityTransform();
            this.context.rect(0, 0, this.getCurrentWidth(), this.getCurrentHeight());
          }
          this.setTargetFresh(false);
        } else {
          if (pFillType === Records.RAW) {
            var tSizzorVerticies = mRawSizzorPolygon.verticies;
            tSizzorVerticies[0] = tSizzorVerticies[1] = tSizzorVerticies[3] = tSizzorVerticies[6] = 0;
            tSizzorVerticies[2] = tSizzorVerticies[4] = pFillData.width;
            tSizzorVerticies[5] = tSizzorVerticies[7] = pFillData.height;

            mRawSizzorPolygon.transform(pProgram.matrix);

            if (sizzorTestPolygonVerticies(tSizzorVerticies, 0, 0, this.canvas.width, this.canvas.height) === false) {
              // Don't render things we can't see.
              return;
            }
          }

          this.updateUniforms(pProgram);
        }
      }

      if (tFragments) {
        // Rasterize
        this.rasterize(
          pFillType,
          pFillData,
          pProgram
        );
      } else if (this._stencilTest) {
        this.context.clip();
      }
    };

    tProto.resetTargetStatus = function (pId) {
      var tId = pId || this._activeTarget;

      this._targetStatus[tId] = {
        identityTransform: true
      };

      this._targetStatusStack[tId] = [];
    };

    tProto.createTarget = function(pWidth, pHeight, pAttachments) {
      var tTargets = this._targets;

      for (var i = 0;; i++) {
        if (tTargets[i] === void 0) {
          tTargets[i] = createCanvasTarget(this, pWidth, pHeight, true, pAttachments);
          this.resetTargetStatus(i);

          return i;
        }
      }
    };

    tProto.destroyTarget = function(pId) {
      if (this._targets[pId] !== void 0) {
        this._targets[pId].release();
        this._targets[pId] = void 0;
      }
    };

    tProto.setTarget = function(pId) {
      var tTarget = this._targets[pId];

      if (tTarget !== void 0) {
        this._activeTarget = pId;
        this.context = tTarget.context;
        this.canvas = tTarget.canvas;
      }
    };

    tProto.getTarget = function() {
      return this._activeTarget;
    };

    tProto.target = function(pId, pProgram) {
      var tTarget = this._targets[pId];

      if (tTarget !== void 0) {
        this.render(
          null,
          Records.RAW,
          {
            image: tTarget.canvas,
            width: tTarget.width,
            height: tTarget.height,
            srcX: 0,
            srcY: 0,
            srcWidth: tTarget.width,
            srcHeight: tTarget.height
          },
          pProgram
        );

        this.setTargetFresh(false);
      }
    };

    tProto.attachToTarget = function(pId, pAttachments) {
      var tTarget = this._targets[pId];
      var tFragment0;

      if (tTarget === void 0) {
        return;
      }

      if (pAttachments.fragments) {
        var tCanvas, tContext;
        tFragment0 = pAttachments.fragments[0];

        if (tFragment0 !== void 0) {
          if (tTarget.attachments.fragments[0]) {
            if (tTarget.key !== null) {
              tTarget.image.release(tTarget.key);
              tTarget.key = null;
            }

            tTarget.image = null;
          }

          tTarget.attachments.fragments[0] = tFragment0;

          if (tFragment0 !== null) {
            var tImage = tTarget.image = tFragments[0];

            if (tImage) {
              var tCanvas = tTarget.canvas = pSurface.getImageDOMElement(tImage);
              var tContext = tTarget.context = tCanvas.getContext('2d');

              tTarget.key = tImage.keep();
              tContext.setTransform(1, 0, 0, 1, 0, 0);
              tContext.clearRect(0, 0, tTarget.width + 1, tTarget.height + 1);
              this.saveContext();

              this.setTargetFresh(true);
            } else {
              tTarget.canvas = null;
              tTarget.context = null;
            }
          }
        }

        if (this._activeTarget === pId) {
          this.canvas = tCanvas;
          this.context = tContext;
        }
      }
    };

    tProto.getTargetAttachments = function(pId) {
      var tTarget = this._targets[pId];

      if (tTarget !== void 0) {
        return tTarget.attachments;
      }

      return null;
    };

    tProto.getTargetWidth = function(pId) {
      if (this._targets[pId] !== void 0) {
        return this._targets[pId].width;
      }
    };

    tProto.getTargetHeight = function(pId) {
      if (this._targets[pId] !== void 0) {
        return this._targets[pId].height;
      }
    };

    tProto.registerTexture = function(pTexture) {
      var tTextures = this.textures;

      for (var i = 0; ; i++) {
        if (tTextures[i] === void 0) {
          pTexture.id = i;
          tTextures[i] = null;
          return;
        }
      }
    };

    tProto.setTextureImage = function(pTexture, pImage) {
      var tDestroy = false;
      if (pImage === null) {
        pImage = DOMImage.obtain(pTexture.getWidth(), pTexture.getHeight());
        tDestroy = true;
      } else {
        if (pImage.constructor !== DOMImage) {
          pImage = DOMImage.fromImage(pImage);
          tDestroy = true;
        }
      }

      this.textures[pTexture.id] = {
        image: pImage,
        key: pImage.keep()
      };

      if (tDestroy) {
        pImage.destroy();
      }
    };

    tProto.setTextureBytes = function(pTexture, pBytes, pX, pY, pWidth, pHeight, pStride) {
      this.textures[pTexture.id].image.setBytes(pBytes, pX, pY, pWidth, pHeight, pStride);
    };

    tProto.getTextureBytes = function(pTexture, pX, pY, pWidth, pHeight, pStride) {
      return this.textures[pTexture.id].image.getBytes(pX, pY, pWidth, pHeight, pStride);
    };

    tProto.destroyTexture = function(pTexture) {
      var tId = pTexture.id;

      if (tId === -1) {
        return;
      }

      var tImageData = this.textures[tId];
      tImageData.image.release(tImageData.key);

      this.textures[tId] = void 0;
    };

    tProto.getImage = function(pId) {
      var tTarget = this._targets[pId];

      if (tTarget !== void 0) {
        return tTarget.image;
      }

      return null;
    };

    tProto.destroy = function() {
      var i, il;
      var tTargets = this._targets;

      this.context = null;
      this.canvas = null;
      this.canvasTarget = null;

      for (i = 0, il = tTargets.length; i < il; i++) {
        if (tTargets[i] !== void 0) {
          tTargets[i].release();
        }
      }

      var tTextures = this.textures;

      for (i = 0, il = tTextures.length; i < il; i++) {
        tTextures[i].image.release(tTextures[i].key);
      }

      this._targets = null;
      this._textures = null;
    };

    function reflowHackFlush() {
      var tCanvas = this._targets[0].canvas;

      // A hack for devices that have a bug
      // where their real size is 'forgotten'
      // and the whole canvas is not updated
      // properly. This forces the browser to
      // reflow and repaint the canvas.

      if (tCanvas.width > 256 || tCanvas.height > 256) {
        // This bug only happens with canvases
        // less than 256x256
        return;
      }

      var tComputedStyle = getComputedStyle(tCanvas);

      if (tComputedStyle !== null) {
        var tPosition = tComputedStyle.position;

        if (tPosition === 'static') {
          tCanvas.style.position = 'relative';
        } else if (tPosition === 'relative') {
          tCanvas.style.position = 'static';
        } else if (tPosition === 'absolute') {
          tCanvas.style.position = 'float';
        } else if (tPosition === 'float') {
          tCanvas.style.position = 'absolute';
        } else {
          tCanvas.style.position = 'static';
        }

        tCanvas.clientLeft;
        tCanvas.style.position = tPosition;
      }
    }

    if (benri.impl.web.graphics.bugs.canvasSizeBug) {
      tProto.flush = reflowHackFlush;
    }

    benri.env.on('setvar', function(pEvent) {
      if (pEvent.varName === 'benri.impl.web.graphics.canvasSizeBug') {
        if (pEvent.varValue === true) {
          tProto.flush = reflowHackFlush;
        } else {
          tProto.flush = function() {};
        }
      }
    });

    tProto.specifyVerticies = function(pVerticies, pProgram) {
      var tVertexShaders = pProgram.getShaders(Shader.TYPE_VERTEX);
      var tVertexShadersLength = tVertexShaders.length;
      var tVertexBuffer = pVerticies.buffer;
      var i;
      var tVertexLocations;
      var tVertexAttributes;

      tVertexBuffer.seek(0);

      tVertexLocations = tVertexBuffer.locations;
      tVertexAttributes = tVertexBuffer.attributes;

      if (tVertexShadersLength !== 0) {
        // For each vertex we do lots of stuff.
        // First off, the vertex shader.

        for (i = 0; i < tVertexShadersLength; i++) {
          tVertexLocations = tVertexShaders[i].execute(tVertexLocations, tVertexAttributes);
        }

        return tVertexLocations;
      } 

      return tVertexLocations;
    };

    tProto.tessellate = function(pType, pVertexLocations, pLocationSize, pAttributes, pProgram) {
      var tContext = this.context;
      var i, il;

      tContext.beginPath();

      if (pType === Records.PATH) {
        var tVectorOps = pAttributes.vectorOp;
        var tVectorOpsData = tVectorOps.data;
        var tVectorOp;
        var tVertexLocation;
        var tAnchor;

        for (i = 0, il = pVertexLocations.length; i < il; i++) {
          tVertexLocation = pVertexLocations[i];
          tVectorOp = tVectorOpsData[i][0];

          if (tVectorOp === 0x2) {
            // anchor
            tContext.lineTo(tVertexLocation[0] | 0, tVertexLocation[1] | 0);
          } else if (tVectorOp === 0x3) {
            // control
            tAnchor = pVertexLocations[i + 1];

            tContext.quadraticCurveTo(
              tVertexLocation[0] | 0,
              tVertexLocation[1] | 0,
              tAnchor[0] | 0,
              tAnchor[1] | 0
            );

            i++;
          } else if (tVectorOp === 0x1) {
            // move
            tContext.moveTo(tVertexLocation[0] | 0, tVertexLocation[1] | 0);
          }
        }
      } else {
        // TODO: handle this later.
      }
    };

    tProto.pushCompositeCanvas = function(pWidth, pHeight, pRecycle) {
      var tCompositeImage;

      if (pRecycle) {
        tCompositeImage = DOMImage.obtain(pWidth, pHeight);
      } else {
        tCompositeImage = DOMImage.obtainFromLRUPool(pWidth, pHeight);
      }

      this._compositeCanvasStack.push({
        image: tCompositeImage,
        context: this.context,
        width: pWidth,
        height: pHeight
      });

      this.context = tCompositeImage.domImage.getContext('2d');
    };

    tProto.takeCompositeCanvas = function() {
      var tComposite = this._compositeCanvasStack.pop();
      var tCompositeImage = tComposite.image;
      this.context = tComposite.context;

      return tCompositeImage;
    };

    tProto.popCompositeCanvas = function(pAlphaMultiplier, pGlobalCompositeOperation) {
      var tComposite = this._compositeCanvasStack.pop();

      var tCompositeImage = tComposite.image;
      var tWidth = tComposite.width;
      var tHeight = tComposite.height;
      var tContext = this.context = tComposite.context;
      var tPreviousAlpha;

      if (pAlphaMultiplier !== 1) {
        tPreviousAlpha = tContext.globalAlpha;
        tContext.globalAlpha = pAlphaMultiplier;
      }

      var tPreviousGlobalCompositeOperation = tContext.globalCompositeOperation;
      tContext.globalCompositeOperation = pGlobalCompositeOperation;

      tContext.drawImage(tCompositeImage.domImage, 0, 0, tWidth, tHeight, 0, 0, tWidth, tHeight);
      this.setIdentityTransform();

      tContext.globalCompositeOperation = tPreviousGlobalCompositeOperation;

      if (pAlphaMultiplier !== 1) {
        tContext.globalAlpha = tPreviousAlpha;
      }

      tCompositeImage.destroy();
    };

    tProto.getCurrentWidth = function() {
      var tCompositeCanvasStack = this._compositeCanvasStack;
      var tLength = tCompositeCanvasStack.length

      if (tLength > 0) {
        return tCompositeCanvasStack[tLength - 1].width;
      }

      return this.getTargetWidth(this.getTarget());
    };

    tProto.getCurrentHeight = function() {
      var tCompositeCanvasStack = this._compositeCanvasStack;
      var tLength = tCompositeCanvasStack.length;

      if (tLength > 0) {
        return tCompositeCanvasStack[tLength - 1].height;
      }

      return this.getTargetHeight(this.getTarget());
    };

    tProto.rasterize = function(pFillType, pFillData, pProgram) {
      var tContext = this.context;
      var tOriginalContext = tContext;
      var tShaders = pProgram.getShaders(Shader.TYPE_FRAGMENT);
      var tShader;
      var tShaderImpl;
      var i;
      var il = tShaders.length;
      var tSkipFill = false;

      pProgram.fillType = pFillType;
      pProgram.fillTypeText = pFillType === Records.FILL ? 'fillStyle' : 'strokeStyle';
      pProgram.fillData = pFillData;
      pProgram.colors = [];

      if (pFillType === Records.STROKE) {
        tContext.lineWidth = pFillData.width * pProgram.matrix.getScaleX();
        tContext.lineCap = pFillData.cap;
        tContext.lineJoin = pFillData.join;
      }

      for (i = 0; i < il; i++) {
        tShader = tShaders[i];
        mFragmentShaders[tShader.name].pre(tShader, this, pProgram);
      }

      for (i = 0; i < il; i++) {
        tShader = tShaders[i];
        tShaderImpl = mFragmentShaders[tShader.name];

        if (tShaderImpl.style) {
          tSkipFill = tShaderImpl.style(tShader, this, pProgram);
        }
      }

      if (tSkipFill === false) {
        if (pFillType === Records.RAW) {
          tContext.drawImage(
            pFillData.image,
            pFillData.srcX,
            pFillData.srcY,
            pFillData.srcWidth,
            pFillData.srcHeight,
            0,
            0,
            pFillData.width,
            pFillData.height
          );
        } else if (pFillType === Records.FILL) {
          tContext.fill();
        } else if (pFillType === Records.STROKE) {
          tContext.stroke();
        }
      }

      this.setTargetFresh(false);

      for (i = 0; i < il; i++) {
        tShader = tShaders[i];
        mFragmentShaders[tShader.name].post(tShader, this, pProgram);
      }

      this.context = tOriginalContext;
    };

    tProto.isTargetFresh = function() {
      return this._targets[this._activeTarget].isFresh;
    };

    tProto.setTargetFresh = function(pIsFresh) {
      this._targets[this._activeTarget].isFresh = pIsFresh;
    };

    function CanvasTarget(pSurface, pAttachments, pWidth, pHeight, pKeep) {
      // TODO: We are breaking the rules for now.
      // Only fragments[0] is supported/handled right now.

      var tFragments = pAttachments.fragments.slice(0);
      var tCanvas, tContext;
      var tImage = this.image = tFragments[0];

      if (tImage) {
        tCanvas = this.canvas = pSurface.getImageDOMElement(tImage);
        tContext = this.context = tCanvas.getContext('2d');

        // For iOS 7 bug where the page lang
        // attribute is set to something other than
        // en, fonts change randomly.
        tCanvas.setAttribute('lang', 'en');

        this.context.save();
      } else {
        tCanvas = this.canvas = null;
        tContext = this.context = null;
      }

      this.attachments = {
        fragments: tFragments
      };

      this.width = pWidth;
      this.height = pHeight;

      if (pKeep) {
        this.key = tImage.keep();
      } else {
        this.key = null;
      }      
      
      this.isFresh = true;
    }

    CanvasTarget.prototype.release = function() {
      if (this.context !== null) {
        this.context.restore();
      }

      if (this.key !== null) {
        this.image.release(this.key);
        this.key = null;
      } else {
        this.image.destroy();
      }

      this.image = this.attachments = this.canvas = this.context = null;
    };

    CanvasTarget.prototype.clear = function() {
      this.context.clearRect(0, 0, this.width + 1, this.height + 1);
    };

    CanvasTarget.prototype.drawTo = function(pContext) {
      pContext.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
    };

    function createCanvasTarget(pSurface, pWidth, pHeight, pRecycle, pAttachments) {
      if (pWidth === -1) {
        pWidth = pSurface.canvasTarget.width;
      }

      if (pHeight === -1) {
        pHeight = pSurface.canvasTarget.height;
      }

      if (pAttachments && pAttachments.fragments) {
        return new CanvasTarget(pSurface, pAttachments, pWidth, pHeight, true);
      } else {
        return new CanvasTarget(pSurface, {
          fragments: [pRecycle ? DOMImage.obtain(pWidth, pHeight) : new DOMImage(pWidth, pHeight)]
        }, pWidth, pHeight, false);
      }
    };

    return Canvas2DSurface;
  }(benri.graphics.Surface));

  benri.impl.add('graphics.surface', function(pData) {
    pData.add(Canvas2DSurface, 7);
  });

  benri.impl.web.graphics.Canvas2DSurface = Canvas2DSurface;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var Matrix2D = benri.geometry.Matrix2D;
  var Color = benri.graphics.draw.Color;
  var Texture = benri.graphics.render.Texture;
  var Records = benri.graphics.Records;
  var Surface = benri.graphics.Surface;

  var deepCopy = benri.util.deepCopy;

  benri.graphics.render.RenderContext = RenderContext;

  /**
   * @class
   * @constructor
   * @param {number} pWidth The width in pixels of this context.
   * @param {number} pHeight The height in pixels of this context.
   */
  function RenderContext(pWidth, pHeight, pSurfaceImplHints) {
    /**
     * The width in pixels.
     * @type {number}
     */
    this.width = pWidth;

    /**
     * The height in pixels.
     * @type {number}
     */
    this.height = pHeight;

    this.matrix = Matrix2D.obtain();

    this.globalUniforms = {};
    /**
     * The stack to hold state information.
     * @private
     * @type {Array}
     */
    this.stack = [];

    /**
     * The background colour of this context.
     * @type {benri.graphics.draw.Color}
     */
    this.backgroundColor = new Color(0, 0, 0, 0);

    /**
     * An object to use for storing state.
     * It will be saved and restored with the save
     * and restore functions.
     * @type {Object}
     */
    this.state = {};

    this.surfaceImplHints = pSurfaceImplHints;

    this.surface = Surface.createSurface(pWidth, pHeight, {recycle: false}, pSurfaceImplHints);

    this.records = new Records();

    this._currentProgram = null;
  }

  /**
   * Saves the current state of the context.
   * Currently this only saves the matrix.
   */
  RenderContext.prototype.save = function() {
    this.stack.push({
      matrix: this.matrix.clone(),
      state: deepCopy(this.state)
    });
  };

  /**
   * Restores a state previously saved.
   */
  RenderContext.prototype.restore = function() {
    var tState = this.stack.pop();
    var tCurrentState = this.state;
    var tPrevState = tState.state;

    if (this.matrix && this.matrix !== tState.matrix) {
      this.matrix.recycle();
    }

    this.matrix = tState.matrix;

    this.state = tPrevState;
  };

  /**
   * Creates a new Texture attached to this context.
   * Don't forget to call destroyTexture when finished with it.
   * @param  {object} pImage The Image to use for the Texture.
   * @return {benri.graphics.render.Texture} The newly created Texture.
   */
  RenderContext.prototype.createTexture = function(pImage) {
    return new Texture(this.surface, pImage.getWidth(), pImage.getHeight(), pImage);
  };

  /**
   * Creates a new Texture with the given dimentions.
   * Use this when you want an empty Texture to render in to.
   * @return {benri.graphics.render.Texture} The newly created Texture.
   */
  RenderContext.prototype.createEmptyTexture = function(pWidth, pHeight) {
    return new Texture(this.surface, pWidth, pHeight, null);
  };

  /**
   * Renders a Texture to this context.
   * @param  {benri.graphics.render.Texture} pTexture The texture to render.
   * @param  {benri.geometry.Rect=} pSourceRect A rectangluar area of the Texture to render to the context.
   * @param  {benri.geometry.Rect=} pDestRect   A rectangular area on the context to render the Texture to.
   */
  RenderContext.prototype.renderTexture = function(pTexture, pSourceRect, pDestRect) {
    var tRecords = this.records;

    tRecords.matrix(this.matrix.clone());

    if (pSourceRect) {
      tRecords.image(
        pTexture,
        pDestRect.getWidth(),
        pDestRect.getHeight(),
        pSourceRect
      );
    } else {
      tRecords.fastImage(pTexture);
    }
  };

  /**
   * Renders the current target to the given Texture.
   * @param  {benri.graphics.render.Texture} pTexture The Texture to render to.
   */
  RenderContext.prototype.renderToTexture = function(pTexture) {
    if (!pTexture) {
      pTexture = this.createEmptyTexture(this.getTargetWidth(), this.getTargetHeight());
    }

    this.flush();

    var tSurface = this.surface;

    pTexture.setImage(tSurface.getImage(tSurface.getTarget()).clone());

    return pTexture;
  };

  /**
   * Clears this context with the background color.
   */
  RenderContext.prototype.clear = function() {
    this.records.clearColor(this.backgroundColor);
  };

  /**
   * Flush all pending operations.
   */
  RenderContext.prototype.flush = function() {
    var tSurface = this.surface;
    var tRecords = this.records;

    tRecords.execute(tSurface, {});
    tSurface.flush();
    tRecords.reset();
  };

  /**
   * Destroy this context.
   */
  RenderContext.prototype.destroy = function() {
    this.surface.destroy();
    this.surface = null;
    this.records.reset();
    this.records = null;
    this.matrix = null;
    this.stack = null;
    this.backgroundColor = null;
  };

  /**
   * Creates a new target to render in to.
   * @param  {number} pWidth  The width of the target.
   * @param  {number} pHeight The height of the target.
   * @return {number}         The ID of the new target.
   */
  RenderContext.prototype.createTarget = function(pWidth, pHeight, pAttachments) {
    return this.records.createTarget(pWidth, pHeight, pAttachments);
  };

  /**
   * Destroys a previously created target.
   * If the currently active target is destroyed
   * the active target is set to the main target.
   * @param  {number} pId The ID of the target to destroy.
   */
  RenderContext.prototype.destroyTarget = function(pId) {
    var tRecords = this.records;
    tRecords.destroyTarget(pId);

    if (tRecords.getTarget() === pId) {
      tRecords.setTarget(0);
    }
  };

  RenderContext.prototype.attachToTarget = function(pId, pAttachments) {
    this.records.attachToTarget(pId, pAttachments);
  };

  /**
   * Renders the given target in to the current target.
   * @param  {number} pId     The ID of the target to render.
   */
  RenderContext.prototype.renderTarget = function(pId) {
    var tRecords = this.records;
    tRecords.matrix(this.matrix.clone());
    tRecords.target(pId);
  };

  /**
   * Sets the currently active target for all render operations
   * to operate on.
   * @param {number} pId The ID of the target.
   */
  RenderContext.prototype.setTarget = function(pId) {
    this.records.setTarget(pId);
  };

  RenderContext.prototype.getTarget = function() {
    return this.records.getTarget();
  };

  RenderContext.prototype.setProgram = function(pProgram) {
    this._currentProgram = pProgram;
    this.records.program(pProgram);
  };

  RenderContext.prototype.executeRecords = function(pRecords) {
    var tRecords = this.records;
    tRecords.matrix(this.matrix.clone());
    tRecords.records(pRecords);
    tRecords.program(this._currentProgram);
  };

  RenderContext.prototype.concatRecords = function(pRecords) {
    var tRecords = this.records;
    tRecords.concat(pRecords);
    tRecords.program(this._currentProgram);
  };

  RenderContext.prototype.setGlobalUniforms = function(pUniforms) {
    this.records.globalUniforms(pUniforms);
  };

  RenderContext.prototype.setUniforms = function(pUniforms) {
    this.records.uniforms(pUniforms);
  };

  /**
   * Gets the current target's current Image.
   */
  RenderContext.prototype.getImage = function() {
    var tSurface = this.surface;

    this.flush();

    return tSurface.getImage(tSurface.getTarget());
  };

  /**
   * Set the size of this context.
   * @param {number} pWidth The width.
   * @param {number} pHeight The height.
   */
  RenderContext.prototype.setSize = function(pWidth, pHeight) {
    this.width = pWidth;
    this.height = pHeight;

    this.surface.destroy();

    this.surface = Surface.createSurface(pWidth, pHeight, {recycle: false}, this.surfaceImplHints);
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  benri.graphics.Program = Program;

  var Keeper = benri.mem.Keeper;
  var Shader = benri.graphics.shader.Shader;
  var Records = benri.graphics.Records;
  var VertexBuffer = benri.geometry.VertexBuffer;
  var Matrix2D = benri.geometry.Matrix2D;
  var Image = benri.graphics.Image;

  var mProgramIdCounter = 0;

  function Program() {
    this.id = ++mProgramIdCounter;

    var tShaders = this._shaders = [];
    tShaders[Shader.TYPE_VERTEX] = [];
    tShaders[Shader.TYPE_CULLING] = [];
    tShaders[Shader.TYPE_FRAGMENT] = [];

    this._uniforms = {};

    this.globalUniforms = {};

    this._uniformTypes = {};

    this._uniformKeeperKeys = {};

    this._onPreExecute = null;
    this._onPostExecute = null;

    this.fillType = null;
    this.fillTypeText = null;
    this.fillData = null;
    this.colors = [];

    this.matrix = Matrix2D.obtain();

    this.globalUniformsAccessTable = {};

    Keeper(this);

    this.on('destroy', onDestroy);
  }

  function onDestroy(pData, pTarget) {
    var tUniforms = pTarget._uniforms;
    var tUniformKeeperKeys = pTarget._uniformKeeperKeys;
    var tShaders = pTarget._shaders;
    var tShader;
    var tCurrentShaders;
    var tShaderIndex, tShadersLength, i, il, k;

    for (tShaderIndex = 0, tShadersLength = tShaders.length; tShaderIndex < tShadersLength; tShaderIndex++) {
      tCurrentShaders = tShaders[tShaderIndex];

      for (i = 0, il = tCurrentShaders.length; i < il; i++) {
        tShader = tCurrentShaders[i];
        tShader.program = null;
      }

      tCurrentShaders.length = 0;
    }

    for (k in tUniformKeeperKeys) {
      tUniforms[k].release(tUniformKeeperKeys[k]);
    }

    pTarget._uniformTypes = null;
    pTarget._uniforms = null;
    pTarget._uniformKeeperKeys = null;
  }

  Program.prototype.attachShader = function(pShader) {
    this._shaders[pShader.type].push(pShader);

    var tProgramUniformTypes = this._uniformTypes;
    var tShaderUniformTypes = pShader.uniformTypes;

    for (var k in tShaderUniformTypes) {
      tProgramUniformTypes[pShader.getUniformName(k)] = tShaderUniformTypes[k];
    }
  };

  Program.prototype.detachShader = function(pShader) {
    var tShaders = this._shaders[pShader.type];
    var tIndex = tShaders.indexOf(pShader);

    if (tIndex !== -1) {
      pShader.program = null;
      tShaders.splice(tIndex, 1);

      var tProgramUniformTypes = this._uniformTypes;
      var tShaderUniformTypes = pShader.uniformTypes;

      for (var k in tShaderUniformTypes) {
        delete tProgramUniformTypes[k];
      }
    }
  };

  Program.prototype.getShaders = function(pType) {
    return this._shaders[pType];
  };

  Program.prototype.setUniform = function(pName, pValue) {
    var tUniformType = this._uniformTypes[pName];
    var tUniforms = this._uniforms;

    if (tUniformType === Image && tUniforms[pName]) {
      tUniforms[pName].release(this._uniformKeeperKeys[pName]);

      if (pValue) {
        tUniformKeeperKeys[pName] = pValue.keep();
      }
    }

    tUniforms[pName] = pValue;
  };

  Program.prototype.setGlobalUniforms = function(pGlobalUniforms) {
    this.globalUniforms = pGlobalUniforms;
  };

  Program.prototype.getUniform = function(pName) {
    return this._uniforms[pName];
  };

  Program.prototype.checkGlobalUniformAccessed = function(pName, accessorId) {
    return this.globalUniformsAccessTable[pName][accessorId] || false;
  };

  Program.prototype.getGlobalUniform = function(pName, accessorId) {
    this.globalUniformsAccessTable[pName][accessorId] = true;

    return this.globalUniforms[pName];
  };

  Program.prototype.getAllUniforms = function() {
    return this._uniforms;
  };

  Program.prototype.onPreExecute = function(pCallback) {
    var tCallbacks = this._onPreExecute || (this._onPreExecute = []);
    tCallbacks.push(pCallback);
  };

  Program.prototype.onPostExecute = function(pCallback) {
    var tCallbacks = this._onPostExecute || (this._onPostExecute = []);
    tCallbacks.push(pCallback);
  };

  // This is here because
  // v8 doesn't want to optimize execute
  // if this for in loop is in it.
  function setRecordUniforms(pUniforms, pUniformsToSet) {
    for (var k in pUniformsToSet) {
      pUniforms[k] = pUniformsToSet[k];
    }
  }

  function setGlobalRecordUniforms(pGlobalUniforms, pGlobalUniformsAccessTable, pUniformsToSet) {
    for (var k in pUniformsToSet) {
      pGlobalUniforms[k] = pUniformsToSet[k];
      pGlobalUniformsAccessTable[k] = {};
    }
  }


  Program.prototype.execute = function(pCommands, pTargetMap, pFlagsStack, pSurface, pGlobalUniforms, pGlobalUniformsAccessTable) {
    var tUniforms = this._uniforms;
    var tVertexList = [];
    var tLocationData;
    var tPoints, tPoint;
    var tCommand, tType;
    var tTarget;
    var tFlags;
    var tFlagsList;
    var tFlag;
    var tVertexBuffer;
    var i, il, j, jl, l;

    this.setGlobalUniforms(pGlobalUniforms);
    this.globalUniformsAccessTable = pGlobalUniformsAccessTable;

    var tCallbacks = this._onPreExecute;

    if (tCallbacks !== null) {
      for (i = 0, il = tCallbacks.length; i < il; i++) {
        tCallbacks[i](this, pSurface);
      }
    }

    for (i = 0, il = pCommands.length; i < il; i++) {
      tCommand = pCommands[i];
      tType = tCommand.type;

      if ((tType & Records.UNIFORMS) === Records.UNIFORMS) {
        if (tType === Records.MATRIX) {
          this.matrix = tCommand.matrix;
        } else if (tType === Records.UNIFORMS) {
          setRecordUniforms(tUniforms, tCommand.map);
        } else if (tType === Records.GLOBALUNIFORMS) {
          setGlobalRecordUniforms(pGlobalUniforms, pGlobalUniformsAccessTable, tCommand.map);
        } else if (tType === Records.UNIFORM) {
          this.setUniform(tCommand.name, tCommand.value);
        } else if (tType === Records.ENABLE) {
          pSurface.enable(tCommand.flag);
        } else if (tType === Records.DISABLE) {
          pSurface.disable(tCommand.flag);
        } else if (tType === Records.PUSHFLAGS) {
          tFlags = tCommand.flags;
          jl = tFlags.length;
          tFlagsList = new Array(jl * 2);

          for (j = 0, l = 0; j < jl; j++, l += 2) {
            tFlag = tFlags[j];
            tFlagsList[l] = tFlag;
            tFlagsList[l + 1] = pSurface.isEnabled(tFlag);
          }

          pFlagsStack.push(tFlagsList);
        } else if (tType === Records.POPFLAGS) {
          tFlagsList = pFlagsStack.pop();

          for (j = 0, jl = tFlagsList.length; j < jl; j += 2) {
            tFlagsList[j + 1] ? pSurface.enable(tFlagsList[j]) : pSurface.disable(tFlagsList[j]);
          }
        } else if (tType === Records.CALLBACK) {
          tCommand.callback(this);
        }
      } else if ((tType & Records.IMAGE) === Records.IMAGE) {
        // Simply render an image.
        if (tType === Records.IMAGE) {
          pSurface.image(tCommand.image, tCommand.width, tCommand.height, tCommand.srcRect, this);
        } else if (tType === Records.FASTIMAGE) {
          pSurface.fastImage(tCommand.image, this);
        }
      } else if ((tType & Records.POINT) === Records.POINT) {
        // We are dealing with verticies.
        // Extract them in to a list of 
        // verticies to deal with later.

        if (tType === Records.POINT) {
          // Handle a point.
          tVertexBuffer = VertexBuffer.create(2, [tCommand.point.x, tCommand.point.y]);
        } else if (tType === Records.PATH) {
          tVertexBuffer = tCommand.path.buffer;
        } else if (tType === Records.POLYGON) {
          // Handle a polygon.
          // A polygon is a collection of
          // verticies that do not disconnect,
          // form a complete closed shape,
          // and do not self intersect.
          tVertexBuffer = VertexBuffer.create(2, tCommand.polygon.verticies);
        }

        tVertexList.push({
          type: tType,
          buffer: tVertexBuffer
        });
      } else if (tType === Records.TEXT) {
        // Render text via the current
        // platform mechanics.
        pSurface.text(tCommand.text, tCommand.style, this);
      } else if ((tType & Records.CREATETARGET) === Records.CREATETARGET) {
        // We are doing target related work.
        if (tType !== Records.CREATETARGET) {
          tTarget = pTargetMap[tCommand.id];

          if (tTarget !== void 0) {
            if (tType === Records.TARGET) {
              pSurface.target(tTarget, this);
            } else if (tType === Records.SETTARGET) {
              pSurface.setTarget(tTarget);
            } else if (tType === Records.DESTROYTARGET) {
              pSurface.destroyTarget(tTarget);
            } else if (tType === Records.ATTACHTOTARGET) {
              // Attach new attachments to the current target.
              pSurface.attachToTarget(tTarget, tCommand.attachments);
            }
          }
        } else {
          // Create a new target and map it with
          // our dummy id.
          pTargetMap[tCommand.id] = pSurface.createTarget(tCommand.width, tCommand.height, tCommand.data);
        }
      } else if ((tType & Records.FILL) === Records.FILL) {
        // Render all current verticies
        // using the given algorithm.
        // We are going to go through the entire
        // render pipeline here.
        this._processVertexList(tVertexList, tType, tCommand.data, pSurface);
      } else if (tType === Records.CLEARDATA) {
        // Clear the verticies list.
        tVertexList.length = 0;
      } else if (tType === Records.CLEARCOLOR) {
        // Clear the colour buffer to the
        // given colour.
        pSurface.clearColor(tCommand.color);
      }
    }

    tCallbacks = this._onPostExecute;

    if (tCallbacks !== null) {
      for (i = 0, il = tCallbacks.length; i < il; i++) {
        tCallbacks[i](this, pSurface);
      }
    }
  };

  Program.prototype._processVertexList = function(pVertexList, pFillType, pFillData, pSurface) {
    var i, il;

    for (i = 0, il = pVertexList.length; i < il; i++) {
      pSurface.render(
        pVertexList[i],
        pFillType,
        pFillData,
        this
      );
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var theatre = global.theatre;
  var benri = global.benri;
  var RenderContext = benri.graphics.render.RenderContext;
  var swfcrew = theatre.crews.swf;
  var Color = benri.graphics.draw.Color;
  var Program = benri.graphics.Program;
  var Shader = benri.graphics.shader.Shader;
  var Matrix2D = benri.geometry.Matrix2D;
  var Rect = benri.geometry.Rect;
  var flag = benri.graphics.Surface.flag;
  var ColorShader = benri.graphics.shader.fragment.ColorShader;
  var ImageShader = benri.graphics.shader.fragment.ImageShader;
  var LinearGradientShader = benri.graphics.shader.fragment.LinearGradientShader;
  var RadialGradientShader = benri.graphics.shader.fragment.RadialGradientShader;
  var ColorTransformShader = benri.graphics.shader.fragment.ColorTransformShader;
  var AlphaShader = benri.graphics.shader.fragment.AlphaShader;
  var ShapeVertexShader = swfcrew.render.ShapeVertexShader;
  var MorphShapeVertexShader = swfcrew.render.MorphShapeVertexShader;

  swfcrew.render.Compositor = Compositor;

  var mShaders = {
    'color': ColorShader,
    'image': ImageShader,
    'linearGradient': LinearGradientShader,
    'radialGradient': RadialGradientShader,
    'colorTransform': ColorTransformShader,
    'alpha': AlphaShader,
    'shape': ShapeVertexShader,
    'morphShape': MorphShapeVertexShader
  };

  // Flag to disable canvas resize.
  var mShapeResize = true;
  // Overall scale factor to apply to all display boxes.
  var mScaleFactor = 1;

  function Compositor(pPlayer, pPixelRatio) {
    /**
     * The Player this compositor is compositing for.
     * @type {theatre.crews.swf.Player}
     */
    this.player = pPlayer;

    this.shapeResize = 'shapeResize' in pPlayer.loader.options ? pPlayer.loader.options.shapeResize : mShapeResize;
    this.scaleFactor = 'scaleFactor' in pPlayer.loader.options ? pPlayer.loader.options.scaleFactor : mScaleFactor;

    var tWidth = this.width = pPlayer._width * this.scaleFactor;
    var tHeight = this.height = pPlayer._height * this.scaleFactor;

    this.pixelRatio = pPixelRatio || 1;

    /**
     * The bound of this SWF file in twips.
     * @type {quickswf.structs.RECT}
     */
    var tBounds = this.bounds = pPlayer.loader.swf.bounds;

    this.offsetX = tBounds.right < tBounds.left ? -tBounds.right : -tBounds.left;
    this.offsetY = tBounds.bottom < tBounds.top ? -tBounds.bottom : -tBounds.top;

    this.widthScale = tWidth / pPlayer.loader.swf.width;
    this.heightScale = tHeight / pPlayer.loader.swf.height;

    this.maskStack = [];

    var tRenderContext = this.context = new RenderContext(tWidth, tHeight, ['3d']);;

    this.state = {
      colorTransform: null,
      isCXFormDirty: false,
      needsUpdateCXForm: true,
      colorTransformHash: ''
    };

    this.stateStack = [];

    var tCamera = this.camera = new theatre.crews.render.Camera(tRenderContext);

    this.applyTransform(tCamera.position);
  }

  var mColorTransformShader;
  var mAlphaShader;

  Compositor.programs = (function() {
    var tPrograms = {};
    var tProgram;
    var tVertexShaders = ['shape', 'morphShape'];
    var tFragmentShaders = ['color', 'image', 'linearGradient', 'radialGradient'];
    var i, il, j, jl;
    var tPackage;

    for (i = 0, il = tVertexShaders.length; i < il; i++) {
      tPrograms[tVertexShaders[i]] = {};

      for (j = 0, jl = tFragmentShaders.length; j < jl; j++) {
        tProgram = new Program();

        tPackage = {
          program: tProgram,
          shaders: {}
        };

        tPackage.shaders[tVertexShaders[i]] = mShaders[tVertexShaders[i]].create(tProgram);
        tPackage.shaders[tFragmentShaders[j]] = mShaders[tFragmentShaders[j]].create(tProgram);
        tPackage.shaders.colorTransform = mShaders.colorTransform.create(tProgram);
        tPackage.shaders.alpha = mShaders.alpha.create(tProgram);

        tPrograms[tVertexShaders[i]][tFragmentShaders[j]] = tPackage;
      }
    }

    tProgram = new Program();

    tPrograms.cache = {
      program: tProgram,
      shaders: {
        alpha: (mAlphaShader = AlphaShader.create(tProgram))
      }
    };

    return tPrograms;
  }());

  Compositor.prototype.setSize = function(pWidth, pHeight, pPixelRatio) {
    this.width = pWidth;
    this.height = pHeight;
    this.pixelRatio = pPixelRatio;

    this.widthScale = pWidth / this.player.loader.swf.width;
    this.heightScale = pHeight / this.player.loader.swf.height;

    this.context.setSize(pWidth, pHeight);
  };

  Compositor.prototype.onRender = function onRender() {
    this.state = {
      colorTransform: null,
      needsUpdateCXForm: true,
      drawingState: 'on-screen',
      colorTransformHash: ''
    };

    this.camera.context.setProgram(Compositor.programs.cache.program);

    this.updateShaders();
  };

  Compositor.prototype.applyTransform = function applyTransform(pMatrix) {
    var tWidthScale = 0.05 * this.widthScale;
    var tHeightScale = 0.05 * this.heightScale;
    
    pMatrix.a *= tWidthScale;
    pMatrix.b *= tHeightScale;
    pMatrix.c *= tWidthScale;
    pMatrix.d *= tHeightScale;
    pMatrix.e += this.offsetX;
    pMatrix.f += this.offsetY;
    pMatrix.e *= tWidthScale;
    pMatrix.f *= tHeightScale;

    pMatrix.transforms = null;

    return pMatrix;
  };

  Compositor.prototype.saveState = function saveState() {
    var tState = this.state;
    var tColorTransform = null;
    var tCurrentCXForm = tState.colorTransform;

    if (tCurrentCXForm !== null) {
      tColorTransform = tCurrentCXForm.clone();
    }

    this.stateStack.push({
      colorTransform: tColorTransform,
      colorTransformHash: tState.colorTransformHash
    });
  };

  Compositor.prototype.restoreState = function restoreState() {
    var tCurrentState = this.state;
    var tParentState = this.state = this.stateStack.pop();

    if (tCurrentState.needsUpdateCXForm === true) {
      tParentState.needsUpdateCXForm = true;
      
      return;
    }

    var tCurrentColorTransform = tCurrentState.colorTransform;
    var tParentColorTransform = tParentState.colorTransform;

    if (tParentColorTransform === null && tCurrentColorTransform === null) {
      tParentState.needsUpdateCXForm = false;

      return;
    }

    if (
        (tParentColorTransform === null && tCurrentColorTransform !== null) ||
        tParentColorTransform.equals(tCurrentColorTransform) === false
      ) {
      tParentState.needsUpdateCXForm = true;
    } else {
      tParentState.needsUpdateCXForm = false;
    }
  };

  Compositor.prototype.startClipping = function startClipping() {
    var tRecords = this.context.records;

    tRecords.pushFlags([flag.FRAGMENTS, flag.STENCIL_TEST]);
    tRecords.disable(flag.FRAGMENTS);
    tRecords.enable(flag.STENCIL_TEST);
    tRecords.enable(flag.STENCIL_SAVE); // hack...
  };

  Compositor.prototype.clipRenderables = function clipRenderables() {
    this.context.records.enable(flag.FRAGMENTS);
  };

  Compositor.prototype.endClipping = function endClipping() {
    var tRecords = this.context.records;
    tRecords.popFlags();
    tRecords.disable(flag.STENCIL_SAVE); // hack...
  };

  Compositor.prototype.updateShaders = function updateShaders() {
    if (this.state.needsUpdateCXForm === false) {
      return;
    }

    this.state.needsUpdateCXForm = false;

    var tColorTransformState = this.state.colorTransform;
    var tColorTransform = {};
    var tAlpha = 1;

    if (tColorTransformState !== null) {
      if (tColorTransformState.alphaAdd === 0) {
        tAlpha = tColorTransformState.alphaMult;
        tColorTransform.alphaMultiplier = 1;
      } else {
        tColorTransform.alphaMultiplier = tColorTransformState.alphaMult;
      }

      // Update all the uniforms to the new values.
      tColorTransform.redMultiplier = tColorTransformState.redMult;
      tColorTransform.greenMultiplier = tColorTransformState.greenMult;
      tColorTransform.blueMultiplier = tColorTransformState.blueMult;
      tColorTransform.redAdd = tColorTransformState.redAdd;
      tColorTransform.greenAdd = tColorTransformState.greenAdd;
      tColorTransform.blueAdd = tColorTransformState.blueAdd;
      tColorTransform.alphaAdd = tColorTransformState.alphaAdd;
    } else {
      // Reset the uniforms to the default values.
      tColorTransform.redMultiplier = 1;
      tColorTransform.greenMultiplier = 1;
      tColorTransform.blueMultiplier = 1;
      tColorTransform.alphaMultiplier = 1;
      tColorTransform.redAdd = 0;
      tColorTransform.greenAdd = 0;
      tColorTransform.blueAdd = 0;
      tColorTransform.alphaAdd = 0;
    } 

    this.context.setGlobalUniforms({
      colorTransform: tColorTransform,
      alpha: tAlpha
    });
  };

  Compositor.prototype.resetColorTransform = function resetColorTransform() {
    var tState = this.state;
    tState.colorTransform = null;
    tState.needsUpdateCXForm = true;

    this.updateCXFormHash();
  };

  Compositor.prototype.setColorTransform = function(pColorTransform) {
    var tState = this.state;

    tState.colorTransform = pColorTransform.clone();
    tState.needsUpdateCXForm = true;
    this.updateCXFormHash();
  };

  Compositor.prototype.updateColorTransform = function updateColorTransform(pColorTransform) {
    var tState = this.state;
    var tColorTransform = tState.colorTransform;

    if (pColorTransform.isIdentity === true) {
      return;
    }

    if (tColorTransform === null) {
      tState.colorTransform = pColorTransform.clone();
    } else {
      tColorTransform.transform(pColorTransform);
    }

    tState.needsUpdateCXForm = true;

    if (pColorTransform.isAlmostIdentity === false) {
      this.updateCXFormHash();
    }
  };

  Compositor.prototype.updateCXFormHash = function updateCXFormHash() {
    var tState = this.state;
    var tColorTransform = tState.colorTransform;

    if (tColorTransform !== null) {
      // Do not use alpha multply in the hashes.
      // So we are anding them out.
      tState.colorTransformHash = 
        'ctm$' + (tColorTransform.multipliers & (0xFFFFFF00 >>> 0)) +
        '$cta$' + tColorTransform.addends +
        '$ctf$' + (tColorTransform.flags & (0xEF >>> 0));
    } else {
      tState.colorTransformHash = '';
    }
  };

  /**
   * Get a surface that can be used to display
   * the SWF file on the screen.
   */
  Compositor.prototype.getSurface = function() {
    return this.context.getImage(0).domImage;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var utils = theatre.crews.swf.utils;

  var Path = benri.geometry.Path;
  var Point = benri.geometry.Point;
  var Rect = benri.geometry.Rect;
  var Matrix2D = benri.geometry.Matrix2D;

  var Color = benri.graphics.draw.Color;
  var ComponentColor = benri.graphics.draw.ComponentColor;
  var StrokeStyle = benri.graphics.draw.StrokeStyle;
  var GradientStyle = benri.graphics.draw.GradientStyle;

  var Records = benri.graphics.Records;
  
  var TYPE_FRAGMENT = benri.graphics.shader.Shader.TYPE_FRAGMENT;
  
  var mPrograms = theatre.crews.swf.render.Compositor.programs;

  var mShape = utils.shape = {};

  function morphPath(pPath, pMorphPath) {
    var tPathBuffer = pPath.buffer;
    var tMorphLocations = pMorphPath.buffer.locations;

    tPathBuffer.registerAttribute('endLocation', 2);

    var tPathEndValueAttributes = tPathBuffer.attributes.endLocation.data;

    for (var i = 0, il = tPathEndValueAttributes.length; i < il; i++) {
      tPathEndValueAttributes[i] = tMorphLocations[i];
    }
  }

  function onMorphShapePreExecute(pProgram, pStyle) {
    var tFragmentShaders = pProgram.getShaders(TYPE_FRAGMENT);
    var tShader;
    var tName;
    var tRatio = pProgram.getGlobalUniform('ratio');
    var tStartColor;
    var tEndColor;
    var tMatrix;
    var tStops;
    var tStop;
    var tShaderColor;
    var tShaderPositions;
    var tShaderColors;
    var tGradientStyle;

    function interpolate(pStart, pEnd, pRatio) {
      return pStart + (pEnd - pStart) * pRatio;
    }

    function interpolateMatrix(pShaderMatrix, pStartMatrix, pEndMatrix, pRatio) {
      pShaderMatrix.set([
        interpolate(pStartMatrix[0], pEndMatrix[0], pRatio),
        interpolate(pStartMatrix[1], pEndMatrix[1], pRatio),
        interpolate(pStartMatrix[2], pEndMatrix[2], pRatio),
        interpolate(pStartMatrix[3], pEndMatrix[3], pRatio),
        interpolate(pStartMatrix[4], pEndMatrix[4], pRatio),
        interpolate(pStartMatrix[5], pEndMatrix[5], pRatio)
      ]);
    }

    for (var i = 0, il = tFragmentShaders.length; i < il; i++) {
      tShader = tFragmentShaders[i];
      tName = tShader.name;

      if (tName === 'ColorShader') {
        tStartColor = pStyle.color;
        tEndColor = pStyle.endColor;
        tShaderColor = tShader.getColor();

        tShaderColor.setRGBA(
          Math.round(interpolate(tStartColor.red, tEndColor.red, tRatio)),
          Math.round(interpolate(tStartColor.green, tEndColor.green, tRatio)),
          Math.round(interpolate(tStartColor.blue, tEndColor.blue, tRatio)),
          interpolate(tStartColor.alpha * 255, tEndColor.alpha * 255, tRatio)
        );
      } else if (tName === 'ImageShader') {
        interpolateMatrix(tShader.getMatrix(), pStyle.matrix, pStyle.endMatrix, tRatio);
      } else if (tName === 'LinearGradientShader' || tName === 'RadialGradientShader') {
        interpolateMatrix(tShader.getMatrix(), pStyle.matrix, pStyle.endMatrix, tRatio);

        tStops = pStyle.gradient.stops;

        tGradientStyle = tShader.getGradientStyle();
        tShaderPositions = tGradientStyle.colorStops;
        tShaderColors = tGradientStyle.stopColors;

        for (i = 0, il = tStops.length; i < il; i++) {
          tStop = tStops[i];

          tShaderPositions[i] = interpolate(tStop.ratio, tStop.endRatio, tRatio);

          tShaderColor = tShaderColors[i];
          tStartColor = tStop.color;
          tEndColor = tStop.endColor;

          tShaderColor.setRGBA(
            Math.round(interpolate(tStartColor.red, tEndColor.red, tRatio)),
            Math.round(interpolate(tStartColor.green, tEndColor.green, tRatio)),
            Math.round(interpolate(tStartColor.blue, tEndColor.blue, tRatio)),
            interpolate(tStartColor.alpha * 255, tEndColor.alpha * 255, tRatio)
          );
        }

        tGradientStyle.convertToRatio(255);
        tGradientStyle.generateSignature();
      }
    }
  }

  function createStrokeStyle(pStyle) {
    var tStyle = new StrokeStyle(pStyle.width);

    tStyle.cap = 'round';
    tStyle.join = 'round';

    return tStyle;
  }

  /**
   * Creates a new Program for the given SWF style.
   * @param  {object} pStyle     The QuickSWF style.
   * @param  {string=line|fill} pType The type of style.
   * @param  {quickswf.utils.MediaLoader} pResources The loaded resources.
   */
  function applyProgram(pStyle, pType, pResources, pIsMorphShape, pRecords) {

    /**
     * @type {string}
     */
    var tType = pStyle.type;

    /**
     * @type {benri.graphics.draw.Color}
     */
    var tColor;

    /**
     * @type {benri.graphics.shader.Shader}
     */
    var tShader;

    /**
     * @type {benri.geometry.Matrix2D}
     */
    var tMatrix;

    var tRatio;

    /**
     * Gradient Stops.
     */
    var tStops, tStop, tShaderColors, tShaderPositions, tGradientStyle;

    /**
     * The Bitmap for patterns.
     */
    var tBitmap;

    var i, il;

    var tProgramPackageBase;
    var tProgramPackage;
    var tUniforms;

    if (pIsMorphShape) {
      tProgramPackageBase = mPrograms.morphShape;
    } else {
      tProgramPackageBase = mPrograms.shape;
    }

    // We use the XOR compositor for shapes of the same style.
    // We do this to support 'holes' inside a shape.
    //new PorterDuffShader(tProgram, 'xor');

    if (tType === 0x00 || pType === 'line') {
      // Solid colour
      tColor = pStyle.color;

      tProgramPackage = tProgramPackageBase.color;

      pRecords.program(tProgramPackage.program);
      pRecords.uniform(
        tProgramPackage.shaders.color.getUniformName('color'),
        new ComponentColor(tColor.red, tColor.green, tColor.blue, tColor.alpha * 255)
      );
    } else if (pStyle.matrix !== null) {
      //tMatrix = Matrix2D.obtainAndAutoRelease(pStyle.matrix);
      tMatrix = Matrix2D.obtain(pStyle.matrix);

      if (tType & 0x10) {
        // A Gradient
        // Gradients are based off of a massive -16384,-16384 to 16384,16384 square.
        // They get sized to the correct size via the matrix at runtime.
        
        tStops = pStyle.gradient.stops;
        tShaderColors = [];
        tShaderPositions = [];

        for (i = 0, il = tStops.length; i < il; i++) {
          tStop = tStops[i];
          tColor = tStop.color;

          tShaderPositions[i] = tStop.ratio;
          tShaderColors[i] = new ComponentColor(tColor.red, tColor.green, tColor.blue, tColor.alpha * 255);
        }

        if (tType === 0x10) {
          // Linear Gradient
          tProgramPackage = tProgramPackageBase.linearGradient;

          pRecords.program(tProgramPackage.program);

          tShader = tProgramPackage.shaders.linearGradient;

          tGradientStyle = new GradientStyle(GradientStyle.TYPE_LINEAR);
          tGradientStyle.startPoint = new Point(-16384, 0);
          tGradientStyle.endPoint = new Point(16384, 0);
          tGradientStyle.colorStops = tShaderPositions;
          tGradientStyle.stopColors = tShaderColors;
          tGradientStyle.convertToRatio(255);
          tGradientStyle.generateSignature();

          tUniforms = {};
          tUniforms[tShader.getUniformName('gradientStyle')] = tGradientStyle;
          tUniforms[tShader.getUniformName('matrix')] = tMatrix;

          pRecords.uniforms(tUniforms);
        } else if (tType === 0x12) {
          // Radial Gradient
          tProgramPackage = tProgramPackageBase.radialGradient;

          pRecords.program(tProgramPackage.program);

          tShader = tProgramPackage.shaders.radialGradient;

          tGradientStyle = new GradientStyle(GradientStyle.TYPE_RADIAL);
          tGradientStyle.startPoint = new Point(0, 0);
          tGradientStyle.endPoint = new Point(0, 0);
          tGradientStyle.startRadius = 0;
          tGradientStyle.endRadius = 16384;
          tGradientStyle.colorStops = tShaderPositions;
          tGradientStyle.stopColors = tShaderColors;
          tGradientStyle.convertToRatio(255);
          tGradientStyle.generateSignature();

          tUniforms = {};
          tUniforms[tShader.getUniformName('gradientStyle')] = tGradientStyle;
          tUniforms[tShader.getUniformName('matrix')] = tMatrix;

          pRecords.uniforms(tUniforms);
        } else if (tType === 0x13) {
          // Focal Radial Gradient
          console.warn('Focal radient detected. Showing it as a normal radial.');
          tProgramPackage = tProgramPackageBase.radialGradient;

          pRecords.program(tProgramPackage.program);

          tShader = tProgramPackage.shaders.radialGradient;

          tGradientStyle = new GradientStyle(GradientStyle.TYPE_RADIAL);
          tGradientStyle.startPoint = new Point(0, 0);
          tGradientStyle.endPoint = new Point(0, 0);
          tGradientStyle.startRadius = 0;
          tGradientStyle.endRadius = 16384;
          tGradientStyle.colorStops = tShaderPositions;
          tGradientStyle.stopColors = tShaderColors;
          tGradientStyle.convertToRatio(255);
          tGradientStyle.generateSignature();

          tUniforms = {};
          tUniforms[tShader.getUniformName('gradientStyle')] = tGradientStyle;
          tUniforms[tShader.getUniformName('matrix')] = tMatrix;

          pRecords.uniforms(tUniforms);
        }
      } else if (tType & 0x40) {
        // Repeating Bitmap or Clipped Bitmap
        tBitmap = pResources.get(pStyle.bitmapId);

        if (!tBitmap) {
          tProgramPackage = tProgramPackageBase.color;

          pRecords.program(tProgramPackage.program);
          pRecords.uniform(
            tProgramPackage.shaders.color.getUniformName('color'),
            new Color(255, 0, 0, 255)
          );
        } else {
          tProgramPackage = tProgramPackageBase.image;

          pRecords.program(tProgramPackage.program);

          tShader = tProgramPackage.shaders.image;
          tUniforms = {};
          tUniforms[tShader.getUniformName('image')] = tBitmap;
          tUniforms[tShader.getUniformName('tileMode')] = tType === 0x40 ? 'repeat' : 'none';
          tUniforms[tShader.getUniformName('matrix')] = tMatrix;

          pRecords.uniforms(tUniforms);

          /*var tTarget = -1;
          var tPreviousTarget = -1;
          var tPreviousMatrix = null;

          tProgram.onPreExecute(function(pProgram, pSurface) {
            // This is a big hack for ColorTransform.
            // If there is a ColorTransform with this ImageShader
            // we will redirect to a new Target
            
            var tShaders = pProgram.getShaders(TYPE_FRAGMENT);

            for (var i = 0, il = tShaders.length; i < il; i++) {
              if (tShaders[i].name === 'ColorTransformShader') {
                tPreviousTarget = pSurface.getTarget();
                tTarget = pSurface.createTarget(pSurface.getCurrentWidth(), pSurface.getCurrentHeight());
                pSurface.setTarget(tTarget);

                tPreviousMatrix = pProgram.getUniform('modelMatrix').clone();

                return;
              }
            }
          });

          tProgram.onPostExecute(function(pProgram, pSurface) {
            if (tTarget !== -1) {
              pSurface.setTarget(tPreviousTarget);

              var tProgram = new Program();
              //pProgram.setUniform('modelMatrix', tPreviousMatrix);
              pSurface.target(tTarget, tProgram);
              pSurface.destroyTarget(tTarget);
            }
          });*/
        }
      }
    } else {
      // Don't know how to support this. Colour it red.
      tProgramPackage = tProgramPackageBase.color;

      pRecords.program(tProgramPackage.program);
      pRecords.uniform(
        tProgramPackage.shaders.color.getUniformName('color'),
        new Color(255, 0, 0, 255)
      );
    }

    if (pIsMorphShape) {
      pRecords.callback(function(pStyle) {
        return function(pProgram) {
          onMorphShapePreExecute(pProgram, pStyle);
        }
      }(pStyle));
    }
  }


  /**
   * @class
   * @extends {Object}
   */
  var Connection = (function() {
    /**
     * @constructor
     * @param {[type]} pAToB
     * @param {[type]} pEdge
     */
    function Connection(pEdgeMap, pKey, pAToB, pEdge) {
      this.edgeMap = pEdgeMap;
      this.key = pKey;
      this.aToB = pAToB;
      this.edge = pEdge;

      this.getPoint = getPoint;
      this.isStartPoint = isStartPoint;
    }

    function getPoint() {
      return this.edgeMap.getPoint(this.key);
    }

    function isStartPoint(pKey) {
      return this.aToB ? pKey === this.edge.a : pKey === this.edge.b;
    }
  
    return Connection;
  })();

  /**
   * @class
   * @extends {Object}
   */
  var EdgeMapPoint = (function() {
    /**
     * @constructor
     * @param {string} pKey
     * @param {number} pX
     * @param {number} pY
     */
    function EdgeMapPoint(pEdgeMap, pKey, pX, pY) {
      this.edgeMap = pEdgeMap;
      this.key = pKey;
      this.x = pX;
      this.y = pY;
      this.c = {};
      this.numOfConnections = 0;

      this.connect = connect;
      this.disconnect = disconnect;
      this.getNextConnection = getNextConnection;
    }

    function connect(pKey, pAToB, pEdge) {
      var tNewConnection = new Connection(this.edgeMap, pKey, pAToB, pEdge);

      if (!(pKey in this.c)) {
        this.c[pKey] = [tNewConnection];
      } else {
        this.c[pKey].push(tNewConnection);
      }

      this.numOfConnections++;
    }

    function getNextConnection(pBothDirection) {
      var tConnections = this.c;
      var tSubConnections;
      var tConnection;
      var tKey = this.key;
      var i, il;

      for (var k in tConnections) {
        tSubConnections = tConnections[k];
        il = tSubConnections.length;

        for (i = 0; i < il; i++){
          tConnection = tSubConnections[i];
          if (pBothDirection || tConnection.isStartPoint(tKey)) {
            return tConnection;
          }          
        }
      }

      return null;
    }

    function disconnect(pKey, pIsStart) {
      if (!(pKey in this.c)) {
        return;
      }

      var tNumOfConnections = --this.numOfConnections;
      var tConnections = this.c[pKey];
      var i, il;

      for (i = 0, il = tConnections.length; i < il; i++) {
        if (tConnections[i].isStartPoint(this.key) === pIsStart) {
          tConnections.splice(i, 1);
          break;
        }
      }

      if (this.c[pKey].length === 0) {
        delete this.c[pKey];
      }

      // If we have no more connections,
      // clean up the main map and get rid of ourself.
      if (tNumOfConnections === 0) {
        this.edgeMap.remove(this.key);
      }
    }
  
    return EdgeMapPoint;
  })();


  /**
   * @class
   * @extends {Object}
   */
  var EdgeMap = (function() {
    /**
     * @constructor
     */
    function EdgeMap() {
      this.map = {};
      this.numOfPoints = 0;

      this.add = add;
      this.remove = remove;
      this.getNextStartPoint = getNextStartPoint;
      this.getPoint = getPoint;
    }

    function add(pEdge, pAToB) {
      var tMap = this.map;
      var tA = pEdge.a;
      var tB = pEdge.b;
      var tEdgeMapPoint;

      if (!(tA in tMap)) {
        tEdgeMapPoint = tMap[tA] = new EdgeMapPoint(this, tA, pEdge.px, pEdge.py);
        this.numOfPoints++;
      } else {
        tEdgeMapPoint = tMap[tA];
      }

      tEdgeMapPoint.connect(tB, pAToB, pEdge);

      if (!(tB in tMap)) {
        tEdgeMapPoint = tMap[tB] = new EdgeMapPoint(this, tB, pEdge.x, pEdge.y);
        this.numOfPoints++;
      } else {
        tEdgeMapPoint = tMap[tB];
      }

      tEdgeMapPoint.connect(tA, pAToB, pEdge);
    }

    function remove(pKey) {
      this.numOfPoints--;
      delete this.map[pKey];
    }

    function getNextStartPoint() {
      for (var k in this.map) {
        return this.map[k];
      }

      return null;
    }

    function getPoint(pKey) {
      return this.map[pKey] || null;
    }
  
    return EdgeMap;
  })();

  function flush(pType, pEdgeMaps, pStyles, pRecords, pResources, pIsMorphShape, pPaths) {
    var i, il, k;
    var tEdgeMap;

    var tFinalPointX;
    var tFinalPointY;

    var tPath;
    var tMorphPath;

    var tMorphFromPointX;
    var tMorphFromPointY;
    var tMorphNextPointX;
    var tMorphNextPointY;
    var tPXorX, tPYorY;

    var tPointConnection;

    var tPointA, tPointB, tCurrentPoint, tNextPoint;
    var tNextPointX, tNextPointY;
    var tAToB;
    var tReverseDirection;

    var tEdge;
    var tEdgeType;

    var tIsLine = pType === 'line';
    var tBothDirection = tIsLine;
    var tProgram;
    var tStrokeStyle;

    var tIsEffective = false;

    // Loop the points. These points' index are Style indicies.
    // That's why we start from 1. (0 is transparent)
    for (i = 1, il = pEdgeMaps.length; i < il; i++) {
      tEdgeMap = pEdgeMaps[i];

      // If this style has no points we abort this style.
      if (tEdgeMap.numOfPoints === 0) {
        continue;
      }

      tPath = null;
      tMorphPath = null;

      if (tIsLine) {
        tStrokeStyle = createStrokeStyle(pStyles[i - 1]);

        if (tStrokeStyle.width === 0) {
          // If this stroke's width is 0, it's invisible, so we just ignore it.
          continue;
        }
      }

      // Create a program for this style.
      applyProgram(pStyles[i - 1], pType, pResources, pIsMorphShape, pRecords);

      while (tEdgeMap.numOfPoints > 0) {
        tPointA = tEdgeMap.getNextStartPoint();

        if (tPointA.numOfConnections === 1 && !tIsLine) {
          // Every fill point needs at least 2 edges
          // attached to it.
          // However if this is a stroke point we can have one.
          console.warn(tPointA.key + ' does not have anything connecting to it!');
        }

        // Grab the first edge of this point. We use it as our starting edge.
        tPointConnection = tPointA.getNextConnection(tBothDirection);

        if (tPointConnection === null) {
          if (!tIsLine) {
            console.error('This fill shape have non-closing lines');
          }

          break;
        }

        tAToB = tPointConnection.aToB;
        tEdge = tPointConnection.edge;

        // Get the next point.
        tPointB = tPointConnection.getPoint();

        if (!tPointB) {
          // There was only one connection
          // Therefore we force the next point
          // to be a to b from the edge
          tCurrentPoint = tPointA;
          tNextPoint = tPointB;
          tFinalPointX = tPointA.x;
          tFinalPointY = tPointA.y;
          tNextPointX = tEdge.x;
          tNextPointY = tEdge.y;

          if (pIsMorphShape) {
            tMorphFromPointX = tEdge.endpx;
            tMorphFromPointY = tEdge.endpy;
            tMorphNextPointX = tEdge.endx;
            tMorphNextPointY = tEdge.endy;

            tPXorX = 'x';
            tPYorY = 'y';
          }
        } else {
          tCurrentPoint = tPointA;
          tNextPoint = tPointB;
          tFinalPointX = tPointA.x;
          tFinalPointY = tPointA.y;
          tNextPointX = tPointB.x;
          tNextPointY = tPointB.y;

          if (pIsMorphShape) {
            if (tAToB) {
              tMorphFromPointX = tEdge.endpx;
              tMorphFromPointY = tEdge.endpy;
              tMorphNextPointX = tEdge.endx;
              tMorphNextPointY = tEdge.endy;

              tPXorX = 'x';
              tPYorY = 'y';
            } else {
              tMorphFromPointX = tEdge.endx;
              tMorphFromPointY = tEdge.endy;
              tMorphNextPointX = tEdge.endpx;
              tMorphNextPointY = tEdge.endpy;

              tPXorX = 'px';
              tPYorY = 'py';
            }
          }
        }

        if (tPath === null) {
          tPath = new Path(tFinalPointX, tFinalPointY);
          pPaths.push(tPath);
        } else {
          tPath.m(tFinalPointX, tFinalPointY);
        }

        if (pIsMorphShape) {
          if (tMorphPath === null) {
            tMorphPath = new Path(tMorphFromPointX, tMorphFromPointY);
          } else {
            tMorphPath.m(tMorphFromPointX, tMorphFromPointY);
          }
        }

        do {
          tEdgeType = tEdge.type;
          tReverseDirection = tPointConnection.isStartPoint(tNextPoint.key);
          // Draw the current edge.
          if (tEdgeType === 2) { // Curve
            tPath.qc(
              tEdge.controlX,
              tEdge.controlY,
              tNextPointX,
              tNextPointY
            );

            if (tMorphPath) {
              tMorphPath.qc(
                tEdge.endControlX,
                tEdge.endControlY,
                tEdge['end' + tPXorX],
                tEdge['end' + tPYorY]
              );
            }
          } else if (tEdgeType === 3) { // Straight
            tPath.l(tNextPointX, tNextPointY);

            if (tMorphPath) {
              tMorphPath.l(tEdge['end' + tPXorX], tEdge['end' + tPYorY]);
            }
          }

          tCurrentPoint.disconnect(tPointConnection.key, !tReverseDirection);

          if (!tNextPoint) {
            break;
          }

          tNextPoint.disconnect(tCurrentPoint.key, tReverseDirection);

          // Check if we have completed a shape
          if (tFinalPointX === tNextPointX && tFinalPointY === tNextPointY) {
            // We have completed a shape!
            // Restart the main loop for the next start point.
            break;
          }

          tPointConnection = tNextPoint.getNextConnection(false);

          if (!tPointConnection) {
            // This will happen with lines (strokes) that
            // do not complete a shape.
            if (!tIsLine) {
              console.error('Could not get the first point connection for ' + tNextPoint.key);
            }

            break;
          }

          tEdge = tPointConnection.edge;
          tCurrentPoint = tNextPoint;
          // Take the next point.
          tNextPoint = tPointConnection.getPoint();

          if (!tNextPoint) {
            break;
          } else {
            tNextPointX = tNextPoint.x;
            tNextPointY = tNextPoint.y;
          }
        } while (true);
      }

      if (tMorphPath) {
        morphPath(tPath, tMorphPath);
      }

      pRecords.path(tPath);

      if (tIsLine) {
        pRecords.stroke(tStrokeStyle);
      } else {
        pRecords.fill();
      }

      pRecords.clearData();

      tIsEffective = true;
    }

    return tIsEffective;
  }

  var StraightEdge = mShape.StraightEdge = function(pX0, pY0, pX1, pY1) {
    this.type = 3;
    this.px = pX0;
    this.py = pY0;
    this.x = pX1;
    this.y = pY1;

    this.a = pX0 + ',' + pY0;
    this.b = pX1 + ',' + pY1;
  };

  var CurvedEdge = mShape.CurvedEdge = function(pX0, pY0, pX1, pY1, pControlX, pControlY) {
    this.type = 2;
    this.px = pX0;
    this.py = pY0;
    this.x = pX1;
    this.y = pY1;
    this.controlX = pControlX;
    this.controlY = pControlY;

    this.a = pX0 + ',' + pY0;
    this.b = pX1 + ',' + pY1;
  };

  var MAX_INT = 9007199254740992;
  var MIN_INT = -9007199254740992;

  mShape.generateRecords = function(pRecords, pBounds) {
    var i, il = pRecords.length;
    var tRecord, tNewRecord;
    var tX = 0, tY = 0;
    var tTempX, tTempY;
    var tPreviousX, tPreviousY;
    var tType;
    var tMinX = MAX_INT, tMaxX = MIN_INT,
        tMinY = MAX_INT, tMaxY = MIN_INT;

    var tUpdateMinMax = function (pX, pY) {
          tMinX = Math.min(tMinX, pX);
          tMaxX = Math.max(tMaxX, pX);
          tMinY = Math.min(tMinY, pY);
          tMaxY = Math.max(tMaxY, pY);
        };

    var tFinalRecords = [];

    for (i = 0; i < il; i++) {
      tRecord = pRecords[i];
      tType = tRecord.type;

      if (tType === 2) {
        // Curve
        tPreviousX = tX;
        tPreviousY = tY;
        tTempX = tX += tRecord.deltaControlX;
        tTempY = tY += tRecord.deltaControlY;
        tNewRecord = new CurvedEdge(
          tPreviousX,
          tPreviousY,
          tX += tRecord.deltaX,
          tY += tRecord.deltaY,
          tTempX,
          tTempY
        );
        tUpdateMinMax(tNewRecord.x, tNewRecord.y);
        tUpdateMinMax(tNewRecord.px, tNewRecord.py);
      } else if (tType === 3) {
        // Line
        tNewRecord = new StraightEdge(
          tX,
          tY,
          tX += tRecord.deltaX,
          tY += tRecord.deltaY
        );
        tUpdateMinMax(tNewRecord.x, tNewRecord.y);
        tUpdateMinMax(tNewRecord.px, tNewRecord.py);
      } else {
        tNewRecord = tRecord;

        if (tRecord.hasMove) {
          tX = tRecord.moveDeltaX;
          tY = tRecord.moveDeltaY;
          tUpdateMinMax(tX, tY);
        }
      }

      tFinalRecords.push(tNewRecord);
    }

    if (pBounds) {
      pBounds.left   = tMinX;
      pBounds.right  = tMaxX;
      pBounds.top    = tMinY;
      pBounds.bottom = tMaxY;
    }

    return tFinalRecords;
  };

  /**
   * Draws the given SWF shape to the given Canvas.
   * @param  {quickswf.structs.Shape} pShape The shape to draw.
   * @param  {benri.graphics.draw.Canvas} pCanvas The Canvas to draw on to.
   * @param  {quickswf.utils.MediaLoader} pResources Loaded resources to use.
   * @return {benri.geometry.Rect} The bounding box that can contain every paths.
   */
  mShape.drawShape = function(pShape, pResources, pIsMorphShape) {
    var tFillStyles = pShape.fillStyles;
    var tLineStyles = pShape.lineStyles;
    var tFillEdges, tLineEdges;
    var tCurrentFillEdges0;
    var tCurrentFillEdges1;
    var tCurrentLineEdges;
    var tCurrentFillStyle0 = null;
    var tCurrentFillStyle1 = null;
    var tCurrentLineStyle = null;

    var tBitmapWidth = 0;
    var tBitmapHeight = 0;
    var tNumberOfBitmaps = 0;
    var tBitmap = null;
    var tIsEffective = false;
    var tHasStroke = false;
    var tSkip = false;
    var tFillStyle;

    var tRecords = pShape.records;
    var tGraphicsRecords = new Records();
    var tFillPaths = [];
    var tLinePaths = [];
    var tRecord;
    var tType;

    var i, il, j, jl;

    function populateFillBuffers() {
      tFillEdges = new Array(tFillStyles.length + 1);

      for (var i = 0, il = tFillEdges.length; i < il; i++) {
        tFillEdges[i + 1] = new EdgeMap();
      }
    }

    function populateLineBuffers() {
      tLineEdges = new Array(tLineStyles.length + 1);

      for (var i = 0, il = tLineEdges.length; i < il; i++) {
        tLineEdges[i + 1] = new EdgeMap();
      }
    }

    populateFillBuffers();
    populateLineBuffers();

    for (i = 0, il = tFillStyles.length; i < il; i++) {
      tFillStyle = tFillStyles[i];

      if (tFillStyle && (tFillStyle.type === 0x41 || tFillStyle.type === 0x43)) {
        tBitmap = pResources.get(tFillStyle.bitmapId);

        if (tBitmap) {
          tNumberOfBitmaps++;

          if (tBitmap.getWidth() > tBitmapWidth) {
            tBitmapWidth = tBitmap.getWidth();
            tSkip = true;
          }

          if (tBitmap.getHeight() >= tBitmapHeight) {
            tBitmapHeight = tBitmap.getHeight();
            tSkip = true;
          }

          if (tSkip) {
            tSkip = false;

            break;
          }
        }
      }
    }

    for (i = 0, il = tRecords.length; i < il; i++) {
      tRecord = tRecords[i];
      tType = tRecord.type;

      if (tType !== 1) { // Not a ChangeStyle
        if (tCurrentFillStyle0 > 0) {
          tCurrentFillEdges0.add(tRecord, false);
        }

        if (tCurrentFillStyle1 > 0) {
          tCurrentFillEdges1.add(tRecord, true);
        }

        if (tCurrentLineStyle > 0) {
          tCurrentLineEdges.add(tRecord, true);
        }
      } else if (tType === 1) { // Change
        if (tRecord.fillStyles !== null) {
          flush('fill', tFillEdges, tFillStyles, tGraphicsRecords, pResources, pIsMorphShape, tFillPaths);
          tFillStyles = tRecord.fillStyles;
          populateFillBuffers();

          for (j = 0, jl = tFillStyles.length; j < jl; j++) {
            tFillStyle = tFillStyles[j];

            if (tFillStyle && (tFillStyle.type === 0x41 || tFillStyle.type === 0x43)) {
              tBitmap = pResources.get(tFillStyle.bitmapId);

              if (tBitmap) {
                tNumberOfBitmaps++;

                if (tBitmap.getWidth() > tBitmapWidth) {
                  tBitmapWidth = tBitmap.getWidth();
                  tSkip = true;
                }

                if (tBitmap.getHeight() >= tBitmapHeight) {
                  tBitmapHeight = tBitmap.getHeight();
                  tSkip = true;
                }

                if (tSkip) {
                  tSkip = false;
                  
                  break;
                }
              }
            }
          }
        }

        if (tRecord.lineStyles !== null) {
          tIsEffective = flush('line', tLineEdges, tLineStyles, tGraphicsRecords, pResources, pIsMorphShape, tLinePaths);
          if (tIsEffective) {
            tHasStroke = true;
          }
          tLineStyles = tRecord.lineStyles;
          populateLineBuffers();
        }

        if (tRecord.fillStyle0 > -1) {
          tCurrentFillStyle0 = tRecord.fillStyle0;
          tCurrentFillEdges0 = tFillEdges[tCurrentFillStyle0];
        }

        if (tRecord.fillStyle1 > -1) {
          tCurrentFillStyle1 = tRecord.fillStyle1;
          tCurrentFillEdges1 = tFillEdges[tCurrentFillStyle1];
        }

        if (tRecord.lineStyle > -1) {
          tCurrentLineStyle = tRecord.lineStyle;
          tCurrentLineEdges = tLineEdges[tCurrentLineStyle];
        }
      }
    }

    flush('fill', tFillEdges, tFillStyles, tGraphicsRecords, pResources, pIsMorphShape, tFillPaths);
    tIsEffective = flush('line', tLineEdges, tLineStyles, tGraphicsRecords, pResources, pIsMorphShape, tLinePaths);

    if (tIsEffective) {
      tHasStroke = true;
    }

    var tVertexCounter = 0;

    for (i = 0, il = tFillPaths.length; i < il; i++) {
      tVertexCounter += tFillPaths[i].buffer.length;
    }

    for (i = 0, il = tLinePaths.length; i < il; i++) {
      tVertexCounter += tLinePaths[i].buffer.length;
    }

    return {
      records: tGraphicsRecords,
      paths: tFillPaths,
      maskRecords: null,
      numOfBitmaps: tNumberOfBitmaps,
      bitmapWidth: tBitmapWidth,
      bitmapHeight: tBitmapHeight,
      numOfVerticies: tVertexCounter,
      hasStroke: tHasStroke
    };
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var quickswf = global.quickswf;
  var mSWFCrew = global.theatre.crews.swf;
  var QuickSWFFillStyle = quickswf.structs.FILLSTYLE;
  var QuickSWFLineStyle = quickswf.structs.LINESTYLE;
  var QuickSWFGradient = quickswf.structs.GRADIENT;
  var QuickSWFStyleChangedRecord = quickswf.structs.STYLECHANGERECORD;
  var QuickSWFStop = quickswf.structs.Stop;
  var Matrix2D = global.benri.geometry.Matrix2D;
  var StraightEdge = mSWFCrew.utils.shape.StraightEdge;
  var CurvedEdge = mSWFCrew.utils.shape.CurvedEdge;
  var shapeGenerateRecords = mSWFCrew.utils.shape.generateRecords;

  var morphshapes = mSWFCrew.utils.morphshapes = {};


  /**
   * @class
   * @extends {StraightEdge}
   */
  var MorphedStraightEdge = (function(pSuper) {
    function MorphedStraightEdge(pAX0, pAY0, pAX1, pAY1, pBX0, pBY0, pBX1, pBY1) {
      pSuper.call(this, pAX0, pAY0, pAX1, pAY1);

      this.endpx = pBX0;
      this.endpy = pBY0;
      this.endx = pBX1;
      this.endy = pBY1;
    }
  
    MorphedStraightEdge.prototype = Object.create(pSuper.prototype);
    MorphedStraightEdge.prototype.constructor = MorphedStraightEdge;
  
    return MorphedStraightEdge;
  })(StraightEdge);

  /**
   * @class
   * @extends {CurvedEdge}
   */
  var MorphedCurvedEdge = (function(pSuper) {
    function MorphedCurvedEdge(pAX0, pAY0, pAX1, pAY1, pAControlX, pAControlY, pBX0, pBY0, pBX1, pBY1, pBControlX, pBControlY) {
      pSuper.call(this, pAX0, pAY0, pAX1, pAY1, pAControlX, pAControlY);

      this.endpx = pBX0;
      this.endpy = pBY0;
      this.endx = pBX1;
      this.endy = pBY1;
      this.endControlX = pBControlX;
      this.endControlY = pBControlY;
    }
  
    MorphedCurvedEdge.prototype = Object.create(pSuper.prototype);
    MorphedCurvedEdge.prototype.constructor = MorphedCurvedEdge;
  
    return MorphedCurvedEdge;
  })(CurvedEdge);

  /**
   * @class
   * @extends {QuickSWFStyleChangedRecord}
   */
  var MorphedQuickSWFStyleChangedRecord = (function(pSuper) {
    /**
     * @constructor
     * @param {[type]} pFillBits
     * @param {[type]} pLineBits
     */
    function MorphedQuickSWFStyleChangedRecord(pFillBits, pLineBits) {
      pSuper.call(this, pFillBits, pLineBits);

      this.endMoveDeltaX = 0;
      this.endMoveDeltaY = 0;
    }
  
    MorphedQuickSWFStyleChangedRecord.prototype = Object.create(pSuper.prototype);
    MorphedQuickSWFStyleChangedRecord.prototype.constructor = MorphedQuickSWFStyleChangedRecord;
  
    return MorphedQuickSWFStyleChangedRecord;
  })(QuickSWFStyleChangedRecord);


  morphshapes.generateRecords = function(pStart, pEnd) {
    var tStartRecordsLength = pStart.length;
    var tEndRecordsLength = pEnd.length;
    var tRecords = new Array(tStartRecordsLength);
    var tStartRecord, tEndRecord, tRecord;
    var tType;
    var tCurrentPoint, tPreviousPoint;
    var i, j;

    var tStartRecords = shapeGenerateRecords(pStart);
    var tEndRecords = shapeGenerateRecords(pEnd);

    var tTempX, tTempY;
    var tXStart = 0, tXEnd = 0, tYStart, tYEnd;
    var tPreviousX, tPreviousY;

    for (i = 0, j = 0; i < tStartRecordsLength;) {
      tStartRecord = tStartRecords[i];
      tEndRecord = tEndRecords[j];

      // The start record always wins.
      tType = tStartRecord.type;

      if (tType === 2) {
        // Curve
        j++;
        if (tEndRecord.type === 3) {
          // Convert it to a curve.
          tRecord = new MorphedCurvedEdge(
            tStartRecord.px,
            tStartRecord.py,
            tStartRecord.x,
            tStartRecord.y,
            tStartRecord.controlX,
            tStartRecord.controlY,
            tEndRecord.px,
            tEndRecord.py,
            tEndRecord.x,
            tEndRecord.y,
            tEndRecord.px + (tEndRecord.x - tEndRecord.px) / 2,
            tEndRecord.py + (tEndRecord.y - tEndRecord.py) / 2
          );
        } else if (tEndRecord.type === 2) {
          tRecord = new MorphedCurvedEdge(
            tStartRecord.px,
            tStartRecord.py,
            tStartRecord.x,
            tStartRecord.y,
            tStartRecord.controlX,
            tStartRecord.controlY,
            tEndRecord.px,
            tEndRecord.py,
            tEndRecord.x,
            tEndRecord.y,
            tEndRecord.controlX,
            tEndRecord.controlY
          );
        } else {
          continue;
        }
      } else if (tType === 3) {
        // Line
        j++;
        if (tEndRecord.type === 2) {
          // Convert it to a curve.
          tRecord = new MorphedCurvedEdge(
            tStartRecord.px,
            tStartRecord.py,
            tStartRecord.x,
            tStartRecord.y,
            tStartRecord.px + (tStartRecord.x - tStartRecord.px) / 2,
            tStartRecord.py + (tStartRecord.y - tStartRecord.py) / 2,
            tEndRecord.px,
            tEndRecord.py,
            tEndRecord.x,
            tEndRecord.y,
            tEndRecord.controlX,
            tEndRecord.controlY
          );
        } else if (tEndRecord.type === 3){
          tRecord = new MorphedStraightEdge(
            tStartRecord.px,
            tStartRecord.py,
            tStartRecord.x,
            tStartRecord.y,
            tEndRecord.px,
            tEndRecord.py,
            tEndRecord.x,
            tEndRecord.y
          );
        } else {
          continue;
        }
      } else {
        // StyleChanged
        tRecord = new MorphedQuickSWFStyleChangedRecord(tStartRecord.fillBits, tStartRecord.lineBits);

        if (tRecord.hasMove = tStartRecord.hasMove) {
          tRecord.moveDeltaX = tStartRecord.moveDeltaX;
          tRecord.moveDeltaY = tStartRecord.moveDeltaY;
          tRecord.endMoveDeltaX = tEndRecord.moveDeltaX;
          tRecord.endMoveDeltaY = tEndRecord.moveDeltaY;
        }

        tRecord.fillStyle0 = tStartRecord.fillStyle0;
        tRecord.fillStyle1 = tStartRecord.fillStyle1;
        tRecord.lineStyle = tStartRecord.lineStyle;

        if (tStartRecord.fillStyles !== null) {
          tRecord.fillStyles = convertFillStyles(tStartRecord.fillStyles);
        }

        if (tStartRecord.lineStyles !== null) {
          tRecord.lineStyles = convertLineStyles(tStartRecord.lineStyles);
        }

        if (tEndRecord.type === 1) {
          j++;
        }
      }

      tRecords[i++] = tRecord;
    }

    return tRecords;
  };

  /**
   * Converts MorphShape fill styles to regular Fill styles.
   * @param  {Array.<object>} pMorphFillStyles The MorphShape fill styles.
   * @return {Array.<object>}                  The regular fill styles.
   */
  var convertFillStyles = morphshapes.convertFillStyles = function(pMorphFillStyles) {
    var i, il = pMorphFillStyles.length;
    var tFillStyles = new Array(il);
    var tStyle;
    var tNewStyle;

    for (i = 0; i < il; i++) {
      tStyle = pMorphFillStyles[i];

      if (!tStyle) {
        continue;
      }

      tNewStyle = tFillStyles[i] = new QuickSWFFillStyle();
      tNewStyle.type = tStyle.type;
      tNewStyle.color = tStyle.startColor;
      tNewStyle.matrix = tStyle.startMatrix;
      tNewStyle.gradient = tStyle.gradient ? convertGradient(tStyle.gradient) : null;
      tNewStyle.bitmapId = tStyle.bitmapId;
      tNewStyle.endColor = tStyle.endColor;
      tNewStyle.endMatrix = tStyle.endMatrix;
      tNewStyle.endGradient = tStyle.endGradient;
    }

    return tFillStyles;
  };

  /**
   * Converts MorphShape line styles to regular line styles.
   * @param  {Array.<object>} pMorphLineStyles The MorphShape line styles.
   * @return {Array.<object>}                  The regular line styles.
   */
  var convertLineStyles = morphshapes.convertLineStyles = function(pMorphLineStyles) {
    var i, il = pMorphLineStyles.length;
    var tLineStyles = new Array(il);
    var tStyle;
    var tNewStyle;

    for (i = 0; i < il; i++) {
      tStyle = pMorphLineStyles[i];

      if (!tStyle) {
        continue;
      }

      tNewStyle = tLineStyles[i] = new QuickSWFLineStyle();
      tNewStyle.width = tStyle.startWidth;
      tNewStyle.color = tStyle.startColor;
      tNewStyle.endWidth = tStyle.endWidth;
      tNewStyle.endColor = tStyle.endColor;
    }

    return tLineStyles;
  };

  /**
   * Converts a MorphShape gradient to a standard gradient
   * @param  {object} pMorphGradient
   * @return {object}                The new gradient.
   */
   function convertGradient(pMorphGradient) {
    var tNewGradient = new QuickSWFGradient();
    var tStops = pMorphGradient.stops;
    var tStop;
    var tOldStop;
    var i, il;

    tNewGradient.spreadMode = pMorphGradient.spreadMode;
    tNewGradient.interpolationMode = pMorphGradient.interpolationMode;
    tNewGradient.focalPoint = pMorphGradient.focalPoint;

    for (i = 0, il = tStops.length; i < il; i++) {
      tStop = new QuickSWFStop();
      tOldStop = tStops[i];
      tStop.ratio = tOldStop.startRatio;
      tStop.color = tOldStop.startColor;
      tStop.endRatio = tOldStop.endRatio;
      tStop.endColor = tOldStop.endColor;

      tNewGradient.stops.push(tStop);
    }

    return tNewGradient;
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var render = theatre.crews.swf.render;
  var Matrix2D = benri.geometry.Matrix2D;
  var mCacheProgram = theatre.crews.swf.render.Compositor.programs.cache.program;

  /**
   * @class
   * @extends {benri.graphics.render.Renderable}
   */
  var DisplayListRenderable = (function(pSuper) {
    function DisplayListRenderable(pRenderData) {
      this.renderData = pRenderData;
      this.records = pRenderData.records;
      this.ratio = 0;
    }

    DisplayListRenderable.prototype = Object.create(pSuper.prototype);
    DisplayListRenderable.prototype.constructor = DisplayListRenderable;

    DisplayListRenderable.prototype.render = function(pRenderContext) {
      if (this.records) {
        pRenderContext.setGlobalUniforms({
          ratio: this.ratio
        });

        pRenderContext.executeRecords(this.records);
      }
    };

    return DisplayListRenderable;

  })(benri.graphics.render.Renderable);

  render.DisplayListRenderable = DisplayListRenderable;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var render = theatre.crews.swf.render;

  /**
   * @class
   * @extends {theatre.crews.swf.render.DisplayListRenderable}
   */
  var EditTextRenderable = (function(pSuper) {
    function EditTextRenderable(pRenderData) {
      pSuper.call(this, pRenderData);
    }

    EditTextRenderable.prototype = Object.create(pSuper.prototype);
    EditTextRenderable.prototype.constructor = EditTextRenderable;

    var superRender = pSuper.prototype.render;

    EditTextRenderable.prototype.render = function(pRenderContext) {
      if (this.renderData.device === true) {
        var tMatrix = pRenderContext.matrix;

        // If there is any rotation or skew, it's not supposed to be rendered.
        // The math floor thing is because flash pro makes some very very very small
        // b or c values that should be 0 but aren't...
        if (Math.floor(tMatrix.b * 10000) !== 0 || Math.floor(tMatrix.c * 10000) !== 0) {
          return;
        }
        
        // For device text, 
        tMatrix.a = tMatrix.d;
      }
      
      superRender.call(this, pRenderContext);
    };

    return EditTextRenderable;

  })(render.DisplayListRenderable);

  render.EditTextRenderable = EditTextRenderable;

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;
  var mHandlers = mSWFCrew.handlers;
  var mShapeUtils = mSWFCrew.utils.shape;
  var ShapeActor = mSWFCrew.actors.ShapeActor;
  var QuickSWFShape = quickswf.structs.Shape;
  var DisplayListRenderable = mSWFCrew.render.DisplayListRenderable;

  /**
   * Handles SWF Shapes.
   * @param {quickswf.structs.Shape} pShape The Shape to handle.
   */
  mHandlers['DefineShape'] = function(pShape) {
    var tBounds = pShape.bounds;

    var tTempShape = new QuickSWFShape();
    tTempShape.bounds = tBounds;
    tTempShape.fillStyles = pShape.fillStyles;
    tTempShape.lineStyles = pShape.lineStyles;
    tTempShape.records = mShapeUtils.generateRecords(pShape.records);

    // Convert and draw the SWF shape in to the new Canvas.
    // Note that only the draw commands were created at this point.
    // We have not flushed the commands or generated a bitmap yet.
    var tRenderData = mShapeUtils.drawShape(tTempShape, this.swf.assetManifest, false);

    if ('shapeCache' in this.options) {
      tRenderData.disableCache = !this.options.shapeCache;
    } else {
      tRenderData.disableCache = false;
    }

    this.register(pShape.id, ShapeActor, {
      renderable: new DisplayListRenderable(tRenderData),
      originX: tBounds.left,
      originY: tBounds.top,
      width: tBounds.right - tBounds.left,
      height: tBounds.bottom - tBounds.top
    });
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;
  var mHandlers = mSWFCrew.handlers;
  var QuickSWFShape = quickswf.structs.Shape;
  var mShapeUtils = mSWFCrew.utils.shape;
  var MorphShapeActor = mSWFCrew.actors.MorphShapeActor;
  var mMorphShapeUtils = mSWFCrew.utils.morphshapes;
  var DisplayListRenderable = mSWFCrew.render.DisplayListRenderable;

  /**
   * Handles SWF MorphShapes.
   * @param {quickswf.structs.MorphShape} pMorphShape The MorphShape to handle.
   */
  mHandlers['DefineMorphShape'] = function(pMorphShape) {
    var tTempShape = new QuickSWFShape();
    tTempShape.fillStyles = mMorphShapeUtils.convertFillStyles(pMorphShape.fillStyles);
    tTempShape.lineStyles = mMorphShapeUtils.convertLineStyles(pMorphShape.lineStyles);
    tTempShape.records = mMorphShapeUtils.generateRecords(pMorphShape.startEdges, pMorphShape.endEdges);

    var tRenderData = mShapeUtils.drawShape(tTempShape, this.swf.assetManifest, true);

    // We don't want to cache morph shapes yet.
    tRenderData.disableCache = true;

    this.register(pMorphShape.id, MorphShapeActor, {
      renderable: new DisplayListRenderable(tRenderData),
      startBounds: pMorphShape.startBounds,
      endBounds: pMorphShape.endBounds
    });
  };
}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var benri = global.benri;
  var Matrix2D = benri.geometry.Matrix2D;
  var Records = benri.graphics.Records;
  var Color = benri.graphics.draw.Color;
  var Program = benri.graphics.Program;
  var Shader = benri.graphics.shader.Shader;
  var ColorShader = benri.graphics.shader.fragment.ColorShader;
  var Surface = benri.graphics.Surface;
  var TextVertexShader = benri.graphics.draw.TextVertexShader;

  benri.graphics.draw.Canvas = Canvas;

  /**
   * A class for drawing 2D bitmaps on to a surface.
   * @class
   * @constructor
   * @param {number} pWidth  The width of the canvas.
   * @param {number} pHeight The height of the canvas.
   */
  function Canvas(pWidth, pHeight) {
    // Finalizes the matrix support.
    this.matrix = Matrix2D.obtain();

    if (!pWidth) {
      pWidth = 1;
    }

    if (!pHeight) {
      pHeight = 1;
    }

    /**
     * The width of this Canvas in pixels.
     * @type {number}
     */
    this.width = pWidth;

    /**
     * The height of this Canvas in pixels.
     * @type {number}
     */
    this.height = pHeight;

    /**
     * The stack used in save and restore calls.
     * @private
     * @type {Array}
     */
    this._stack = [];

    /**
     * The current draw command records that have
     * yet to be flushed to the surface.
     * @type {Array}
     */
    this.records = new Records();

    /**
     * The Surface of this Canvas.
     * @type {benri.graphics.draw.Surface}
     */
    this.surface = null;

    /**
     * Holds the last used matrix.
     * @private
     * @type {benri.geometry.Matrix2D}
     */
    this._lastMatrix = this.matrix.clone();

    /**
     * Holds the states of each layer in the Canvas.
     * @private
     * @type {Array}
     */
    this._layerStates = [];

    this._target = 0;
    this._program = null;
    this._colorShader = null;

    this.hints = {
      recycle: true,
      isStatic: true
    };
  }

  /**
   * Sets the surface for this Canvas
   * @param {benri.graphics.draw.Surface} pSurface The Surface.
   */
  Canvas.prototype.setSurface = function(pSurface) {
    this.surface = pSurface;
  };

  Canvas.prototype.getSurface = function() {
    return this.surface;
  };

  /**
   * Returns true if the this Canvas is dirty and needs to be flushed.
   * @return {boolean}
   */
  Canvas.prototype.isDirty = function() {
    return !this.hints.isStatic || this.records.getLength() !== 0;
  };

  /**
   * If the current matrix has not yet been
   * added as a record for the surface, add it now.
   * @private
   */
  Canvas.prototype._syncMatrix = function() {
    if (!this.matrix.equals(this._lastMatrix)) {
      this.records.matrix(this.matrix.clone());

      if (this._lastMatrix) {
        this._lastMatrix.recycle();
      }

      this._lastMatrix = this.matrix.clone();
    }
  };

  Canvas.prototype.setProgram = function(pProgram) {
    this._program = pProgram;
    this.records.program(pProgram);
  };

  Canvas.prototype.getProgram = function() {
    return this._program;
  };

  Canvas.prototype.setColor = function(pColor) {
    if (this._colorShader) {
      this._colorShader.color = pColor;
    } else {
      var tProgram = new Program();
      this._colorShader = ColorShader.create(tProgram, {
        color: pColor
      });
      this.setProgram(tProgram);
    }
  };

  Canvas.prototype.getColor = function() {
    if (this._colorShader) {
      return this._colorShader.color.clone();
    }

    return null;
  };

  /**
   * Fill the given Path with the given Style.
   * @param  {benri.geometry.Path} pPath  The Path to fill.
   */
  Canvas.prototype.fillPolygon = function(pPolygon) {
    var tRecords = this.records;

    this._syncMatrix();

    tRecords.polygon(pPolygon);
    tRecords.fill();
    tRecords.clearData();
  };

  /**
   * Fill the given Path.
   * @param  {benri.geometry.Path} pPath The Path to stroke.
   */
  Canvas.prototype.fillPath = function(pPath) {
    var tRecords = this.records;

    this._syncMatrix();

    tRecords.path(pPath);
    tRecords.fill();
    tRecords.clearData();
  };

  /**
   * Stroke the given Path with the given StrokeStyle.
   * @param  {benri.geometry.Path} pPath The Path to stroke.
   * @param  {benri.graphics.draw.StrokeStyle} pStrokeStyle The StrokeStyle to use to stroke.
   */
  Canvas.prototype.strokePath = function(pPath, pStrokeStyle) {
    var tRecords = this.records;

    this._syncMatrix();

    tRecords.path(pPath);
    tRecords.stroke(pStrokeStyle);
    tRecords.clearData();
  };

  /**
   * Draws the given Image to this Canvas using the given Style
   * @param  {object} pImage The Image to draw.
   * @param  {number=0} pDestX  The x coordinate to start the draw at.
   * @param  {number=0} pDestY  The y coordinate to start the draw at.
   */
  Canvas.prototype.drawImage = function(pImage, pDestX, pDestY) {
    if (pDestX !== 0 || pDestY !== 0) {
      this.save();
      this.matrix.translate(pDestX, pDestY);
      this._syncMatrix();
      this.restore();
    } else {
      this._syncMatrix();
    }

    tRecords.fastImage(pImage);
  };

  /**
   * Draws the given Image to this Canvas using the given Style
   * at the given position.
   * @param  {object} pImage The Image to draw.
   * @param  {benri.geometry.Rect} pDestRect  The destination on this Canvas to draw to.
   * @param  {benri.geometry.Rect} pSourceRect  The source rect to sample from to draw to the Canvas.
   */
  Canvas.prototype.drawImageWithRects = function(pImage, pDestRect, pSourceRect) {
    this._syncMatrix();

    this.records.image(pImage, pDestRect, pSourceRect);
  };

  /**
   * Draws text to the Canvas.
   * @param  {string} pText The text to draw.
   * @param  {benri.graphics.draw.TextStyle} pStyle  The Style to use to draw the text.
   */
  Canvas.prototype.drawText = function(pText, pStyle) {
    var tFont = pStyle.font;
    var tRecords = this.records;
    var tProgram = new Program();

    tRecords.program(tProgram);
    this._syncMatrix();

    ColorShader.create(tProgram, {
      color: pStyle.color
    });

    if (tFont.system) {
      // Draw using system font.
      tRecords.text(pText, pStyle);
    } else {
      // Draw using glyph data.
      var tCharCode, tGlyph,
          tFontScale = pStyle.fontHeight / tFont.dimension,
          tXPos = pStyle.leftMargin, tYPos = pStyle.topMargin, tInitialXPos,
          tPaths;
      
      TextVertexShader.create(tProgram);

      // Adjust the alignment
      if (pStyle.align === 'center') {
        tXPos += (pStyle.maxWidth - pStyle.textWidth) / 2;
      } else if (pStyle.align === 'right') {
        tXPos += (pStyle.maxWidth - pStyle.textWidth);
      }

      tInitialXPos = tXPos;

      // Iterate on each char.
      for (var i = 0, il = pText.length; i < il; i++) {
        tCharCode = pText.charCodeAt(i);

        if (tCharCode === 10 || tCharCode === 13) {
          tXPos = tInitialXPos;
          tYPos += pStyle.fontHeight + (tFont.leading ? tFont.leading * tFontScale : 0);

          continue;
        }

        tGlyph = tFont.getGlyph(tCharCode);

        if (!tGlyph) {
          continue;
        }

        tPaths = tGlyph.paths;

        var tTextMatrix, tTempMatrix;
        if (pStyle.matrix) {
          tTempMatrix = Matrix2D.obtainAndAutoRelease([tFontScale, 0, 0, tFontScale, tXPos, tYPos]);
          tTextMatrix = pStyle.matrix.clone().multiply(tTempMatrix);
        } else {
          tTextMatrix = Matrix2D.obtain([tFontScale, 0, 0, tFontScale, tXPos, tYPos]);
        }

        // Set scale.
        tRecords.uniforms({'textMatrix': tTextMatrix});

        // Append the glyph data to this.record
        for (var j = 0, jl = tPaths.length; j < jl; j++) {
          tRecords.path(tPaths[j]);
        }

        tRecords.fill();
        tRecords.clearData();

        // Calculate the glyph's position.
        tXPos += Math.floor(tGlyph.advance * tFontScale);
      }
    }

    tRecords.program(this._program);
  };

  /**
   * Clears the Canvas with the given Color.
   * @param  {benri.graphics.draw.Color} pColor The Color to clear with.
   */
  Canvas.prototype.clear = function(pColor) {
    if (this.surface !== null) {
      this.surface.clearRecords();
    }

    var tRecords = this.records;

    tRecords.reset();

    this._syncMatrix();

    tRecords.clearColor(pColor || new Color(0, 0, 0, 0));
  };

  /**
   * Flush the drawing records of this Canvas to the underlying Surface.
   */
  Canvas.prototype.flush = function() {
    var tSurface = this.surface;

    if (!tSurface) {
      tSurface = this.surface = Surface.createSurface(this.width, this.height, this.hints, ['2d', 'vector']);
    }

    if (!this.isDirty()) {
      return;
    }

    var tRecords = this.records;

    tRecords.execute(tSurface);

    tRecords.reset();

    this._program = null;
    this._colorShader = null;
  };

  /**
   * Gets an Image representation of this Canvas.
   * When this is called, all draw commands must
   * be flushed first so that the Image returned
   * is a representation of the current draw records.
   * @return {benri.graphics.draw.Image} The Image.
   */
  Canvas.prototype.getImage = function() {
    this.flush();

    if (this.surface === null) {
      return null;
    }

    return this.surface.getImage(0);
  };

  /**
   * Saves the current state of this Canvas.
   * Currently this only saves the current matrix.
   */
  Canvas.prototype.save = function() {
    this._stack.push({
      matrix: this.matrix.clone(),
      program: this._program
    });
  };

  /**
   * Restores a state previously saved by a call to save.
   */
  Canvas.prototype.restore = function() {
    var tState = this._stack.pop();
    if (this.matrix && this.matrix !== tState.matrix) {
      this.matrix.recycle();
    }
    this.matrix = tState.matrix;

    var tCurrentProgram = this._program;
    var tPreviousProgram = tState.program;

    if (tPreviousProgram !== tCurrentProgram) {
      this.records.program(tPreviousProgram);
      this._program = tPreviousProgram;
    }
  };

  /**
   * Returns benri.graphics.Records object.
   */
  Canvas.prototype.getRecords = function(pSplice) {
    var tRecords;

    if (pSplice) {
      tRecords = this.records;

      this.records = new Records();
    } else {
      tRecords = this.records;
    }

    return tRecords;
  };

  /**
   * Appends benri.graphics.Records object.
   * @param {benri.graphics.Records} pRecords
   */
  Canvas.prototype.appendRecords = function(pRecords) {
    this.records.concat(pRecords);
  };

  /**
   * Destroys this Canvas and all resources associated with it.
   * Do not use this Canvas after calling this function.
   */
  Canvas.prototype.destroy = function() {
    var tSurface = this.surface;

    this.records.destroy();

    this.records = null;
    this.matrix = null;

    if (tSurface !== null) {
      tSurface.destroy();
      this.surface = null;
    }
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var theatre = global.theatre;
  var mShapeUtils = theatre.crews.swf.utils.shape;
  var Canvas = global.benri.graphics.draw.Canvas;
  var Color = global.benri.graphics.draw.Color;
  var Glyph = global.benri.graphics.draw.Glyph;
  var QuickSWFShape = quickswf.structs.Shape;
  var CXFORM = quickswf.structs.CXFORM;
  var Shader = benri.graphics.shader.Shader;
  var ColorTransformShader = benri.graphics.shader.fragment.ColorTransformShader;
  var AlphaShader = benri.graphics.shader.fragment.AlphaShader;

  theatre.crews.swf.render.renderPropOnEditTextPreRender = onEditTextPreRender;
  theatre.crews.swf.render.renderPropOnEditTextPostRender = onEditTextPostRender;

  function isOutOfBounds(pFont, pGlyph) {
    var tBounds = pGlyph.bounds;

    if (tBounds && tBounds.left < 0
        || tBounds.right > pFont.dimension) {
      // We do not see the top and bottom.
      return true;
    }
    return false;
  }

  function createGlyph(pCharCode, pSwfShape, pAdvance) {
    var tTempShape = new QuickSWFShape();

    tTempShape.bounds = pSwfShape.bounds;
    tTempShape.fillStyles = pSwfShape.fillStyles;
    tTempShape.lineStyles = pSwfShape.lineStyles;

    var tBounds = {};
    tTempShape.records = mShapeUtils.generateRecords(pSwfShape.records, tBounds);

    var tDrawData = mShapeUtils.drawShape(tTempShape, null, false);

    var tGlyph = new Glyph(pCharCode, tDrawData.paths);
    tGlyph.advance = pAdvance;
    tGlyph.bounds = tBounds;

    return tGlyph;
  }

  function onEditTextPreRender(pPackage, pTarget) {
    var tActor = pTarget.actor;
    var tCompositor = tActor.player.compositor;
    var i, il, j, jl;

    if (tActor.clipDepth > 0) {
      pPackage.stop();

      return;
    }

    // Get rid of alpha from device text as this is what Flash Player does.
    if (tActor.device) {
      var tColorTransform = tActor.colorTransform;
      var tState = tCompositor.state;
      var tContextColorTransform = tState.colorTransform;

      if (tColorTransform && (tColorTransform.alphaMult !== 1 || tColorTransform.alphaAdd !== 0)) {
        tColorTransform.alphaMult = 1;
        tColorTransform.alphaAdd = 0;
        tColorTransform.update();
      }

      if (tContextColorTransform !== null) {
        // Create an inverted transform to identity for alpha.
        if (tContextColorTransform.alphaMult !== 1 || tContextColorTransform.alphaAdd !== 0) {
          //tCompositor.saveState();
          tContextColorTransform = tContextColorTransform.clone();
          tContextColorTransform.alphaMult = 1;
          tContextColorTransform.alphaAdd = 0;
          tContextColorTransform.update();

          tCompositor.setColorTransform(tContextColorTransform);
        }
      }
    }

    if (pTarget.needRender) {
      //pTarget.updateHash(tActor);

      var tCanvas = new Canvas(0, 0);
      var tString = tActor.text;
      var tStyle = tActor.style.clone();
      var tFont = tStyle.font;
      var tCharCode, tFontInfo, tAdvance,
          tGlyph, tShape, tOutOfBounds = false;

      if (!tActor.device && tString) {
        // Rebuild glyphs.
        var tTextWidth = 0;

        for (i = 0, il = tString.length; i < il; i++) {
          tCharCode = tString.charCodeAt(i);

          // Get advance.
          tFontInfo = tActor.lookupTable[tCharCode + ''];
          tAdvance = tFontInfo ? tFontInfo.advance
            : (tCharCode < 256 ? tStyle.fontHeight / 2 : tStyle.fontHeight);
          // Get glyph data.
          tGlyph = tFont.getGlyph(tCharCode);

          if (!tGlyph && tFontInfo) {
            tShape = tFontInfo.shape;
            tShape.fillStyles[0].color = tStyle.color;
            tGlyph = createGlyph(tCharCode, tShape, tAdvance);
            tFont.setGlyph(tCharCode, tGlyph);
          }

          if (tGlyph) {
            tTextWidth += tGlyph.advance;
            if ((i === 0 || i === il -1) && !tOutOfBounds && isOutOfBounds(tFont, tGlyph)) {
              // If the first or the last character's shape is out of bounds,
              // it is likely that the text doesn't fit in the bounding box.
              // (Note that this is just a hint and in fact, we need to consider line break.)
              // In such the case, we don't create cache image and simply do vector drawing.
              // Otherwise, the text would be cropped out of the cache image.
              tOutOfBounds = true;
            }
          }
        }

        tStyle.textWidth = tTextWidth * tStyle.fontHeight / 1024;
      }

      // Draw text.
      tCanvas.drawText(tString, tStyle);

      pTarget.needRender = false;

      var tRecords = tCanvas.getRecords(true);
      var tPrograms = tRecords.getPrograms();
      var tShaders;
      var tShader;

      main: for (i = 0, il = tPrograms.length; i < il; i++) {
        tShaders = tPrograms[i].getShaders(Shader.TYPE_FRAGMENT);

        for (j = 0, jl = tShaders.length; j < jl; j++) {
          tShader = tShaders[j];

          if (tShader.name === 'ColorTransformShader') {
            continue main;
          }
        }

        ColorTransformShader.create(tPrograms[i]);
        AlphaShader.create(tPrograms[i]);
      }

      if (tActor.data.renderable.records !== null) {
        tActor.data.renderable.records.destroy();
      }
      
      tActor.data.renderable.renderData.records = tRecords;
    }
  }

  function onEditTextPostRender(pPackage, pTarget) {
    var tCompositor = pTarget.actor.player.compositor;

    //if (tCompositor.state.isCXFormDirty) {
      //tCompositor.restoreState(true);
    //}
  }

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  var mActors = theatre.crews.swf.actors;
  var ASHandlers = theatre.crews.swf.ASHandlers;

  /**
   * @class
   * @extends {theatre.crews.swf.actors.DisplayListActor}
   */
  var EditTextActor = (function(pSuper) {
    var BoundsProp = theatre.crews.bounds.BoundsProp;
    var onPreRender = theatre.crews.swf.render.renderPropOnEditTextPreRender;
    var onPostRender = theatre.crews.swf.render.renderPropOnEditTextPostRender;
    var onRenderable = theatre.crews.swf.render.renderPropOnRenderable;

    var EditTextRenderable = theatre.crews.swf.render.EditTextRenderable;

    function EditTextActor(pArgs) {
      pSuper.call(this, pArgs);

      this.props.add(
        new BoundsProp(pArgs.originX, pArgs.originY, pArgs.width, pArgs.height)
      );

      // TODO: Add cache prop?

      this.data.renderable = new EditTextRenderable({
        records: null,
        paths: null,
        maskRecords: null,
        numOfBitmaps: 0,
        bitmapWidth: 0,
        bitmapHeight: 0,
        numOfVerticies: Infinity,
        device: pArgs.device
      });

      var tTextProp;

      this.on('renderprop', function onRenderProp(pProp, pTarget) {
        tTextProp = pProp;
        pProp.needRender = true;
        pProp.on('prerender', onPreRender);
        pProp.on('postrender', onPostRender);
        pProp.on('renderable', onRenderable);
      });

      this.text = pArgs.initialText;

      this.device = pArgs.device;
      this.lookupTable = pArgs.lookupTable;
      this.style = pArgs.style.clone();

      // Set up variable accessor methods.
      var tVarName = pArgs.variableName;
      var tProcessedVariableName = pArgs.processedVariableName;
      var tSelf = this, tParent;

      var updateText = function(pValue) {
        if (pValue === void 0 || pValue === null) {
          pValue = '';
        } else {
          pValue = pValue + '';
        }

        tSelf.text = pValue;
        tSelf.invalidate();

        tTextProp.needRender = true;
      };

      if (tProcessedVariableName) {
        this.on('enter', function(pData, pTarget) {
          var tTargetData = ASHandlers.GetTargetAndFrame(tProcessedVariableName, pTarget.parent);

          if (tTargetData === null) {
            tParent = pTarget.parent;
            tVarName = tProcessedVariableName;
          } else {
            tParent = tTargetData.target;
            tVarName = tTargetData.label;
          }

          if (tParent) {
            var tText = tParent.getVariable(tVarName);

            if (tText === void 0) {
              tParent.setVariable(tVarName, pTarget.text);
            } else {
              updateText.call(pTarget, tText);
            }

            tParent.addVariableListener(tVarName, updateText);
          }
        });

        this.on('leave', function () {
          if (tParent) {
            tParent.removeVariableListener(tVarName, updateText);
          }
        });
      }
    }

    EditTextActor.prototype = Object.create(pSuper.prototype);
    EditTextActor.prototype.constructor = EditTextActor;

    return EditTextActor;
  })(mActors.DisplayListActor);

  mActors.EditTextActor = EditTextActor;

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;
  var mHandlers = mSWFCrew.handlers;
  var SpriteActor = mSWFCrew.actors.SpriteActor;
  var Scene = theatre.Scene;
  var ColorTransform = mSWFCrew.structs.ColorTransform;
  var TextActor = mSWFCrew.actors.TextActor;
  var EditTextActor = mSWFCrew.actors.EditTextActor;
  var Matrix2D = benri.geometry.Matrix2D;

  var mActionsMap = mSWFCrew.actionsMap;

  /**
   * Creates a new closure that will run
   * when we want to execute ActionScript in the
   * correct context.
   */
  function createLoaderWrapper(pActionScriptLoader, pActionScriptProgram, pScripts, pSWFVersion) {
    var tId = pActionScriptLoader.load(
      pActionScriptProgram,
      pScripts,
      {
        version: pSWFVersion
      }
    );

    return function(pActor) {
      pActionScriptProgram.run(tId, pActor, pActor.player.root);
    }
  }

  /**
   * Handles SWF Sprites.
   * @param {quickswf.structs.Sprite} pSprite The Sprite to handle.
   */
  mHandlers['DefineSprite'] = function(pSprite) {
    var tActorMap = this.actorMap;
    var tScene = new Scene();
    var tSceneEditor = tScene.edit();

    var tFrames = pSprite.frames;
    var tLength = tFrames.length;
    var tFrame;
    var i, il, j, jl, k;
    var tData;
    var tType;
    var tName;
    var tActorMapData;
    var tArgs;
    var tLabels = pSprite.frameLabels;
    var tSceneActorMap = [];

    tScene.setLength(tLength);

    for (k in tLabels) {
      tScene.setLabel(k.toLowerCase(), tLabels[k]);
    }

    for (i = 0; i < tLength; i++) {
      tFrame = tFrames[i];

      if (tFrame === void 0) {
        continue;
      }

      tSceneEditor.stepTo(i);

      for (j = 0, jl = tFrame.length; j < jl; j++) {
        tData = tFrame[j];
        tType = tData.type;

        if (tType === 'move') {
          if (tSceneActorMap[tData.depth] !== void 0) {
            tSceneEditor.moveTo(tSceneActorMap[tData.depth], tData.matrix);
          }
        } else if (tType === 'add') {
          tActorMapData = tActorMap[tData.id];

          if (tActorMapData === void 0) {
            continue;
          }

          tName = tData.name ? tData.name : '';

          tArgs = {
            swfName: tName
          };

          for (k in tActorMapData.args) {
            tArgs[k] = tActorMapData.args[k];
          }

          tSceneActorMap[tData.depth] = tSceneEditor.add(tActorMapData.clazz, {
            layer: tData.depth,
            position: tData.matrix,
            name: tName.toLowerCase(),
            args: tArgs
          });
        } else if (tType === 'script') {
          // We handle scripts differently than other commands.
          // Create a new context for them to run in.
          tSceneEditor.script(createLoaderWrapper(this.actionScriptLoader, this.actionScriptProgram, tData.script, this.swf.version));
        } else if (tType === 'remove') {
          if (tSceneActorMap[tData.depth] !== void 0) {
            tSceneEditor.remove(tSceneActorMap[tData.depth]);
            tSceneActorMap[tData.depth] = void 0;
          }
        } else if (tType === 'replace') {
          tActorMapData = tActorMap[tData.id];

          if (tActorMapData === void 0) {
            continue;
          }

          tName = tData.name ? tData.name : '';

          tArgs = {
            swfName: tName
          };

          for (k in tActorMapData.args) {
            tArgs[k] = tActorMapData.args[k];
          }

          if (tSceneActorMap[tData.depth] !== void 0) {
            var tOldActorId = tSceneActorMap[tData.depth];
            var tActorId = tSceneActorMap[tData.depth] = tScene.getNextActorId();
            tSceneEditor.prepare(mActionsMap[tType], {
              clazz: tActorMapData.clazz,
              newId: tActorId,
              oldId: tOldActorId,
              layer: tData.depth,
              position: tData.matrix,
              name: tName.toLowerCase(),
              args: tArgs
            });
          }
        } else if (tType === 'colorTransform') {
          tSceneEditor.prepare(mActionsMap[tType], {
            id: tSceneActorMap[tData.depth],
            colorTransform: ColorTransform.fromQuickSWF(tData.colorTransform)
          });
        } else if (tType in mActionsMap) {
          if ('depth' in tData) {
            if (tSceneActorMap[tData.depth] !== void 0) {
              tData.id = tSceneActorMap[tData.depth];
              tSceneEditor.prepare(mActionsMap[tType], tData);
            }
          } else {
            tSceneEditor.prepare(mActionsMap[tType], tData);
          }
        }
      }
    }

    this.register(pSprite.id, SpriteActor, {
      scene: tScene
    });
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;
  var mHandlers = mSWFCrew.handlers;
  var Color = benri.graphics.draw.Color;
  var Font = benri.graphics.draw.Font;
  var TextStyle = benri.graphics.draw.TextStyle;
  var EditTextActor = mSWFCrew.actors.EditTextActor;
  var DisplayListRenderable = mSWFCrew.render.DisplayListRenderable;

  var onRender = mSWFCrew.render.renderPropOnEditTextRender;
  var onPostRender = mSWFCrew.render.renderPropOnEditTextPostRender;

  function createFont(pSwfFont, pDeviceText) {
    var tFont = new Font();
    tFont.name = pSwfFont.name;
    tFont.ascent = pSwfFont.ascent;
    tFont.descent = pSwfFont.descent;
    tFont.leading = pSwfFont.leading;
    tFont.italic = pSwfFont.italic;
    tFont.bold = pSwfFont.bold;
    tFont.system = pDeviceText;

    return tFont;
  }

  function createTextStyle(pEditText, pFont) {
    var tTextStyle = new TextStyle(pFont);
    var tSwfColor = pEditText.textcolor;

    tTextStyle.color = new Color(tSwfColor.red, tSwfColor.green, tSwfColor.blue, pEditText.useoutline ? tSwfColor.alpha * 255 : 255);
    tTextStyle.fontHeight = Math.floor(pEditText.fontheight);
    tTextStyle.leftMargin = Math.floor((pEditText.leftmargin || 0)) + pEditText.bounds.left;
    tTextStyle.topMargin = Math.floor((pEditText.leading || 0)) + pEditText.bounds.top;

    if (pEditText.leading) {
      // Override the font's leading.
      pFont.leading = Math.floor(pEditText.leading * 1024 / pEditText.fontheight);
    }

    var tAscent = pFont.ascent ? pFont.ascent : 1024;

    tTextStyle.topMargin += Math.floor(tAscent * tTextStyle.fontHeight / 1024);
    tTextStyle.maxWidth = Math.floor(
      (pEditText.bounds.right - pEditText.bounds.left
        - pEditText.leftmargin - pEditText.rightmargin)
    );
    tTextStyle.align = pEditText.align === 1 ? 'right' : (pEditText.align === 2 ? 'center' : 'left');
    tTextStyle.wrap = !!pEditText.wrap;
    tTextStyle.multiline = !!pEditText.multiline;

    return tTextStyle;
  }

  function doPreprocessVariableName(pVarName) {
    // Replace the last dot with a colon.
    var tVarName = pVarName.replace(/([^\.\/])\.([^\.\/]*)$/, '$1:$2');
    // Replace any other dot with a slash.
    tVarName = tVarName.replace(/([^\.\/])\.([^\.\/])/g, '$1/$2');
    // Remove the first colon.
    tVarName = tVarName.replace(/^:/, '');
    // Replace '_parent' with '..'
    return tVarName.replace(/_parent/, '..');
  }

  /**
   * Handles SWF EditTexts.
   * @param {quickswf.structs.EditText} pText The EditText to handle.
   */
  mHandlers['DefineEditText'] = function(pEditText) {
    var tBounds = pEditText.bounds;
    var tFontId = pEditText.font;
    var tSwfFont = this.swf.fonts[tFontId];
    var tDeviceText = !pEditText.useoutline;
    var tFont, tStyle;

    if (tSwfFont === void 0) {
      this.register(tId, theatre.crews.swf.actors.DisplayListActor, {});

      return;
    }

    // Create font.
    tFont = this.getFontCache(tFontId);

    if (!tFont) {
      tFont = createFont(tSwfFont, tDeviceText);
      this.setFontCache(tFontId, tFont);
    } else if (tFont.system !== tDeviceText) {
      // This is the case:
      //  - two texts share the same font.
      //  - one wants to be rendered as a glyph text.
      //  - the other as a device text.
      tFont = createFont(tSwfFont, tDeviceText);

      // We overwrite the cache only when the font has the glyph data.
      if (tDeviceText === false) {
        this.setFontCache(tFontId, tFont);
      }
    }

    this.register(pEditText.id, EditTextActor, {
      originX: tBounds.left,
      originY: tBounds.top,
      width: tBounds.right - tBounds.left,
      height: tBounds.bottom - tBounds.top,
      initialText: pEditText.initialtext || '',
      style: createTextStyle(pEditText, tFont),
      device: tDeviceText,
      lookupTable: tSwfFont.lookupTable,
      variableName: pEditText.variablename,
      processedVariableName: doPreprocessVariableName(pEditText.variablename)
    });
  };

}(this));

/**
 * @author Kuu Miyazaki
 *
 * Copyright (C) 2012 SWFCrew Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
(function(global) {

  var mSWFCrew = theatre.crews.swf;
  var mHandlers = mSWFCrew.handlers;
  var mShapeUtils = mSWFCrew.utils.shape;
  var TextActor = mSWFCrew.actors.TextActor;
  var Color = global.benri.graphics.draw.Color;
  var Canvas = global.benri.graphics.draw.Canvas;
  var Font = global.benri.graphics.draw.Font;
  var Glyph = global.benri.graphics.draw.Glyph;
  var TextStyle = global.benri.graphics.draw.TextStyle;
  var Matrix2D = global.benri.geometry.Matrix2D;
  var QuickSWFShape = quickswf.structs.Shape;
  var Shader = benri.graphics.shader.Shader;
  var ColorTransformShader = benri.graphics.shader.fragment.ColorTransformShader;
  var AlphaShader = benri.graphics.shader.fragment.AlphaShader;
  var DisplayListRenderable = mSWFCrew.render.DisplayListRenderable;

  function createFont(pSwfFont) {
    var tFont = new Font();
    tFont.name = pSwfFont.name;
    tFont.ascent = pSwfFont.ascent;
    tFont.descent = pSwfFont.descent;
    tFont.leading = pSwfFont.leading;
    tFont.italic = pSwfFont.italic;
    tFont.bold = pSwfFont.bold;

    return tFont;
  }

  function isOutOfBounds(pFont, pGlyph) {
    var tBounds = pGlyph.bounds;

    if (tBounds && tBounds.left < 0
        || tBounds.right > pFont.dimension) {
      // We do not see the top and bottom.
      return true;
    }
    return false;
  }

  function createGlyph(pCharCode, pSwfShape, pAdvance, pMediaLoader) {
    var tTempShape = new QuickSWFShape();
    tTempShape.bounds = pSwfShape.bounds;
    tTempShape.fillStyles = pSwfShape.fillStyles;
    tTempShape.lineStyles = pSwfShape.lineStyles;

    var tBounds = {};
    tTempShape.records = mShapeUtils.generateRecords(pSwfShape.records, tBounds);

    var tDrawData = mShapeUtils.drawShape(tTempShape, pMediaLoader, false);
    var tGlyph = new Glyph(pCharCode, tDrawData.paths);
    tGlyph.advance = pAdvance;
    tGlyph.bounds = tBounds;

    return tGlyph;
  }

  function createTextStyle(pTextRecord, pFont, pXOffset, pYOffset, pWidth) {
    var tTextStyle = new TextStyle(pFont);
    var tSwfColor = pTextRecord.color;

    tTextStyle.color = new Color(tSwfColor.red, tSwfColor.green, tSwfColor.blue, tSwfColor.alpha * 255);
    tTextStyle.fontHeight = Math.floor(pTextRecord.height);
    tTextStyle.leftMargin = Math.floor(pXOffset);
    tTextStyle.topMargin = Math.floor(pYOffset);
    tTextStyle.maxWidth = Math.floor(pWidth);

    return tTextStyle;
  }

  /**
   * Handles SWF Texts.
   * @param {quickswf.structs.Text} pText The Text to handle.
   */
  mHandlers['DefineText'] = function(pText) {
    var tSWF = this.swf;
    var tBounds = pText.bounds;
    var tTwipsWidth = tBounds.right - tBounds.left;
    var i, il, j, jl;

    // Create a new Canvas to render to.
    // We are only taking the records so size doesn't matter.
    var tCanvas = new Canvas(0, 0);
    var tTextRecords = pText.textrecords;
    var tOutOfBounds = false;

    // Iterate on each text line.
    for (i = 0, il = tTextRecords.length; i < il; i++) {
      var tTextRecord = tTextRecords[i],
          tFontId = tTextRecord.id,
          tSwfFont = tSWF.fonts[tFontId],
          tGlyphList = tTextRecord.glyphs, tSwfGlyph,
          tFontScale = tTextRecord.height / 1024,
          tXOffset = tTextRecord.x + tTextRecord.xAdvance,
          tYOffset = tTextRecord.y,
          tFont, tStyle, tGlyph, tCharCode, tString = '',
          tShape, tGlyphIndex;

      // Get benri.graphics.draw.Font object.
      if (!(tFont = this.getFontCache(tFontId))) {
        tFont = createFont(tSwfFont);
        this.setFontCache(tFontId, tFont);
      }

      // Iterate on each character.
      for (j = 0, jl = tGlyphList.length; j < jl; j++) {
        // Get character code.
        tSwfGlyph = tGlyphList[j];
        tGlyphIndex = tSwfGlyph.index;

        if (tSwfFont.codeTable && (tCharCode = tSwfFont.codeTable[tGlyphIndex])) {
          ;
        } else {
          tCharCode = tGlyphIndex;
        }

        // Get glyph data.
        tGlyph = tFont.getGlyph(tCharCode);

        if (!tGlyph) {
          tShape = tSwfFont.shapes[tGlyphIndex];
          tShape.fillStyles[0].color = tTextRecord.color;
          tGlyph = createGlyph(tCharCode, tShape, Math.floor(tSwfGlyph.advance / tFontScale), tSWF.assetManifest);
          tFont.setGlyph(tCharCode, tGlyph);
        }

        if ((j === 0 || j === jl -1) && !tOutOfBounds && isOutOfBounds(tFont, tGlyph)) {
          // If the first or the last character's shape is out of bounds,
          // it is likely that the text doesn't fit in the bounding box.
          // (Note that this is just a hint and in fact, we need to consider line break.)
          // In such the case, we don't create cache image and simply do vector drawing.
          // Otherwise, the text would be cropped out of the cache image.
          tOutOfBounds = true;
        }

        // Build text.
        tString += String.fromCharCode(tCharCode);
      }

      // Create style.
      tStyle = createTextStyle(tTextRecord, tFont, tXOffset, tYOffset, tTwipsWidth);

      // Draw text.
      if (pText.matrix) {
        tStyle.matrix = Matrix2D.obtain(pText.matrix);
      }

      tCanvas.drawText(tString, tStyle);
    } // [loop end] -- for each text line.

    var tRecords = tCanvas.getRecords(true);
    var tPrograms = tRecords.getPrograms();
    var tShaders;
    var tShader;

    main: for (i = 0, il = tPrograms.length; i < il; i++) {
      tShaders = tPrograms[i].getShaders(Shader.TYPE_FRAGMENT);

      for (j = 0, jl = tShaders.length; j < jl; j++) {
        tShader = tShaders[j];

        if (tShader.name === 'ColorTransformShader') {
          continue main;
        }
      }

      ColorTransformShader.create(tPrograms[i]);
      AlphaShader.create(tPrograms[i]);
    }

    this.register(pText.id, TextActor, {
      originX: tBounds.left,
      originY: tBounds.top,
      width: tBounds.right - tBounds.left,
      height: tBounds.bottom - tBounds.top,
      renderable: new DisplayListRenderable({
        records: tRecords,
        paths: null,
        maskRecords: null,
        numOfBitmaps: 0,
        bitmapWidth: 0,
        bitmapHeight: 0,
        outOfBounds: tOutOfBounds,
        numOfVerticies: Infinity
      })
    });
  };

}(this));

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2014 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function() {

  benri.content.Manifest = Manifest;

  var mGetBlobClasses = benri.content.Blob.getClasses;
  var MimeType = benri.content.MimeType;

  /**
   * @class
   * @constructor
   * @param {Object=} pPackage A package describing the manifest.
   */
  function Manifest(pPackage) {
    benri.event.PersistentEventEmitter(this);

    this._repo = {};
    this._entryLoadingCounter = 0;

    if (pPackage) {
      this.addMultiple(pPackage);
    }
  }

  var tProto = Manifest.prototype;

  function finishLoadingEntry(pManifest) {
    if (--pManifest._entryLoadingCounter <= 0) {
      pManifest._entryLoadingCounter = 0; // Just in case...

      pManifest.emit('load'); // What to do with errors?
    }
  }

  /**
   * Add a new URL resource to this Manifest
   * @param {string} pId  A unique ID to identify this resource by
   * @param {string|benri.net.URL} pURL The URL to download from
   * @param {string} pMimeType The mimetype of the resource
   * @return {benri.content.Manifest} This Manifest
   */
  tProto.addURL = function(pId, pURL, pMimeType) {
    var tRepo = this._repo;
    var tMimeType = pMimeType instanceof MimeType ? pMimeType : new MimeType(pMimeType);
    var tEntry;

    if (pId in tRepo) {
      tEntry = tRepo[pId];
    } else {
      tEntry = tRepo[pId] = new ManifestEntry(pId, this);
    }

    tEntry.addURL(pURL, tMimeType);

    return this;
  };

  /**
   * Add a new URL resource to this Manifest
   * @param {string} pId  A unique ID to identify this resource by
   * @param {benri.io.Buffer} pData The data of the resource
   * @param {string|benri.content.MimeType} pMimeType The mimetype of the resource
   * @return {benri.content.Manifest} This Manifest
   */
  tProto.addBuffer = function(pId, pBuffer, pMimeType) {
    var tRepo = this._repo;
    var tMimeType = pMimeType instanceof MimeType ? pMimeType : new MimeType(pMimeType);
    var tEntry;

    if (pId in tRepo) {
      tEntry = tRepo[pId];
    } else {
      tEntry = tRepo[pId] = new ManifestEntry(pId, this);
    }

    tEntry.addBuffer(pBuffer, tMimeType);

    return this;
  };

  tProto.addMultiple = function(pPackage) {


    return this;
  };

  tProto.remove = function(pId) {
    var tItem = this._repo[pId];
    var tVariants;
    var k;
    var tToRemove;
    var i, il;

    if (tItem !== void 0) {
      tVariants = tItem.variants;
      tToRemove = [];

      for (k in tVariants) {
        tToRemove.push(k);
      }

      for (i = 0, il = tToRemove.length; i < il; i++) {
        tItem.remove(tToRemove[i]);
      }

      this.resetEvent('entryLoad_' + tItem.id);
      this.resetEvent('entryError_' + tItem.id);
    }

    return this;
  };

  tProto.onLoad = function(pCallback) {
    this.on('load', pCallback);
  };

  tProto.ignoreLoad = function(pCallback) {
    this.ignore('load', pCallback);
  };

  tProto.onEntryLoad = function(pId, pCallback) {
    this.on('entryLoad_' + pId, pCallback);
  };

  tProto.onEntryProgress = function(pId, pCallback) {
    this.on('entryProgress_' + pId, pCallback);
  };

  tProto.onEntryError = function(pId, pCallback) {
    this.on('entryError_' + pId, pCallback);
  };

  tProto.ignoreEntryLoad = function(pId, pCallback) {
    this.ignore('entryLoad_' + pId, pCallback);
  };

  tProto.ignoreEntryProgress = function(pId, pCallback) {
    this.ignore('entryProgress_' + pId, pCallback);
  };

  tProto.ignoreEntryError = function(pId, pCallback) {
    this.ignore('entryError_' + pId, pCallback);
  };

  tProto.get = function(pId) {
    var tItem = this._repo[pId];

    if (tItem === void 0 || tItem.status !== STATUS_LOADED) {
      return null;
    }

    return tItem.activeVariant.blob;
  };

  tProto.load = function() {
    var tRepo = this._repo;
    var k, v;
    var tItem = void 0;

    for (k in tRepo) {
      tItem = tRepo[k];

      if (tItem.status === STATUS_IDLE) {
        this._entryLoadingCounter++;
        tItem.load();
      }
    }

    if (tItem === void 0) {
      // When there were no entries
      this.emit('load');
    }
  };

  tProto.destroy = function() {
    var tRepo = this._repo;
    var tToRemove = [];
    var k;
    var i, il;

    for (k in tRepo) {
      tToRemove.push(k);
    }

    for (i = 0, il = tToRemove; i < il; i++) {
      this.remove(tToRemove[i]);
    }
  };

  var VARIANT_TYPE_URL = 1;
  var VARIANT_TYPE_BUFFER = 2;

  var STATUS_IDLE = 0;
  var STATUS_LOADING = 1;
  var STATUS_LOADED = 2;
  var STATUS_ERROR = 3;

  function ManifestEntry(pId, pManifest) {
    /**
     * The unique ID of this entry
     * @type {string}
     */
    this.id = pId;

    this.manifest = pManifest;

    /**
     * Map of MIME types to variants.
     * @type {Object}
     */
    this.variants = {};

    this.activeVariant = null;

    this.status = STATUS_IDLE;

    this.addURL = entryAddURL;
    this.addBuffer = entryAddBuffer;
    this.remove = entryRemove;
    this.load = entryLoad;
  }

  function entryAddURL(pURL, pMimeType) {
    var tVariants = this.variants;
    var tMimeString = pMimeType.toString();

    if (tMimeString in tVariants) {
      this.remove(tMimeString);
    }

    tVariants[tMimeString] = {
      variantType: VARIANT_TYPE_URL,
      type: pMimeType,
      url: pURL,
      buffer: null,
      blob: null,
      blobClass: null
    };
  }

  function entryAddBuffer(pBuffer, pMimeType) {
    var tVariants = this.variants;
    var tMimeString = pMimeType.toString();

    if (tMimeString in tVariants) {
      this.remove(tMimeString);
    }

    tVariants[tMimeString] = {
      variantType: VARIANT_TYPE_BUFFER,
      type: pMimeType,
      url: null,
      buffer: pBuffer,
      blob: null,
      blobClass: null
    };
  }

  function entryRemove(pMimeType) {
    var tVariant = this.variants[pMimeType];

    if (tVariant) {
      this.manifest.emitOnce('remove', tVariant);

      delete this.variants[pMimeType];
    }
  }

  function entryLoad() {
    this.status = STATUS_LOADING;

    var tVariants = this.variants;
    var tVariant, k;
    var tClasses;
    var tBestClass, tBestVariant;
    var tBestScore = -1;
    var tThenCB = createEntryBlobThenCallback(this);
    var tAsCB = createEntryBlobThenCallback(this);
    var tCatchCB = createEntryBlobThenCallback(this);

    for (k in tVariants) {
      tVariant = tVariants[k];
      tClasses = mGetBlobClasses(tVariant.type);

      if (tClasses.bestScore >= tBestScore) {
        tBestVariant = tVariant;
        tBestClass = tClasses.best;
        tBestScore = tClasses.bestScore;
      }
    }

    tBestVariant.blobClass = tBestClass;
    this.activeVariant = tBestVariant;

    if (tBestVariant.variantType === VARIANT_TYPE_BUFFER) {
      tBestClass.fromBuffer(tBestVariant.buffer, tBestVariant.type)
      .then(tThenCB)
      .as(tAsCB)
      .catch(tCatchCB);
    } else {
      (new benri.net.Request(tBestVariant.url, 'GET', true)).send()
      .then(function (pResponse) {
        tBestClass.fromBuffer(pResponse.body, tBestVariant.type)
        .then(tThenCB)
        .as(tAsCB)
        .catch(tCatchCB);
      }).catch(tCatchCB);
    }
  }

  function createEntryBlobThenCallback(pEntry) {
    return function(pBlob) {
      var tId = pEntry.id;
      var tManifest = pEntry.manifest;

      pEntry.activeVariant.blob = pBlob;
      pEntry.status = STATUS_LOADED;

      tManifest.emit('entryLoad_' + tId, {
        id: tId,
        blob: pBlob,
        type: pEntry.activeVariant.type
      });

      finishLoadingEntry(tManifest);
    }
  }

  function createEntryBlobAsCallback(pEntry) {
    return function(pBlob) {
      var tId = pEntry.id;

      pEntry.activeVariant.blob = pBlob;

      pEntry.manifest.emitOnce('entryProgress_' + tId, {
        id: tId,
        blob: pBlob,
        type: pEntry.activeVariant.type
      });
    }
  }

  function createEntryBlobCatchCallback(pEntry) {
    return function(pReason) {
      var tId = pEntry.id;
      var tManifest = pEntry.manifest;

      pEntry.status = STATUS_ERROR;

      tManifest.emit('entryError_' + tId, {
        id: tId,
        type: pEntry.activeVariant.type,
        reason: pReason
      });

      finishLoadingEntry(tManifest);
    }
  }

}());

/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */

(function(global) {

  // TODO

}(this));
/**
 * @author Jason Parrott
 *
 * Copyright (C) 2013 BenriJS Project.
 * This code is licensed under the zlib license. See LICENSE for details.
 */
/*
(function(global) {
return;
  if (!global.WebGLRenderingContext) {
    return;
  }

  var mCanvasContextName = (function() {
    var tCanvasContextNames = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var tCanvas = document.createElement('canvas');
    var tContext;

    tCanvas.width = tCanvas.height = 1;

    for (var i = 0, il = tCanvasContextNames.length; i < il; i++) {
      if (tCanvas.getContext(tCanvasContextNames[i])) {
        return tCanvasContextNames[i];
      }
    }

    return '';
  }());

  if (!mCanvasContextName) {
    return;
  }
  var WebGLSurface = (function(pSuper) {
    var DOMImage = benri.impl.web.graphics.DOMImage;
    var Texture = benri.graphics.render.Texture;
    var Matrix2D = benri.geometry.Matrix2D;
    var flag = benri.graphics.Surface.flag;

    function WebGLSurface(pWidth, pHeight, pHints) {
      pSuper.call(this, pWidth, pHeight, pHints);
      
      var tImage = this.image = new DOMImage(pWidth, pHeight, document.createElement('canvas'));
      var tCanvas = this.canvas = tImage.domImage;
      tCanvas.width = pWidth;
      tCanvas.height = pHeight;
      var tContext = this.context = tCanvas.getContext(mCanvasContextName);

      tContext.antialias = false;
      tContext.depth = false;
      tContext.stencil = false;

      tContext.disable(tContext.DEPTH_TEST);
      tContext.enable(tContext.BLEND);
      tContext.blendFunc(tContext.ONE, tContext.ONE_MINUS_SRC_ALPHA);

      this._activeTarget = 0;

      this._targets = [];

      new Target(this, pWidth, pHeight, true, null)

      this._textures = [];

      this._currentProgram = null;
      this._programs = [];

      tContext.depthRange(0, 1);

      tContext.viewport(0, 0, pWidth, pHeight);

      this.perspectiveMatrix = Matrix2D.obtainAndAutoRelease([
        2 / pWidth,
        0,
        0,
        -2 / pHeight,
        -1,
        1
      ]);

      var tProgram = tContext.createProgram();

      var tVertexShader = tContext.createShader(tContext.VERTEX_SHADER);
      tContext.shaderSource(tVertexShader, [
        'uniform mat4 mWorldMatrix;',

        'attribute vec2 aPosition;',
        'attribute vec2 aTexCoord;',

        'varying vec2 vTexCoord;',

        'void main(void) {',
          'vTexCoord = aTexCoord;',
          'gl_Position = mWorldMatrix * vec4(aPosition, 0.5, 1.0);',
        '}'
      ].join('\n'));
      tContext.compileShader(tVertexShader);

      tContext.attachShader(tProgram, tVertexShader);

      var tFragmentShader = tContext.createShader(tContext.FRAGMENT_SHADER);
      tContext.shaderSource(tFragmentShader, [
        'precision mediump float;',

        'uniform sampler2D mTexture;',

        'varying vec2 vTexCoord;',

        'void main(void) {',
          'gl_FragColor = texture2D(mTexture, vTexCoord);',
        '}'
      ].join('\n'));
      tContext.compileShader(tFragmentShader);

      tContext.attachShader(tProgram, tFragmentShader);

      tContext.linkProgram(tProgram);
      tContext.useProgram(tProgram);

      this._worldMatrixUniformLocation = tContext.getUniformLocation(tProgram, 'mWorldMatrix');
      this._textureUniformLocation = tContext.getUniformLocation(tProgram, 'mTexture');

      this._positionAttributeLocation = tContext.getAttribLocation(tProgram, 'aPosition');
      this._texcoordAttributeLocation = tContext.getAttribLocation(tProgram, 'aTexCoord');

      tContext.enableVertexAttribArray(this._positionAttributeLocation);
      tContext.enableVertexAttribArray(this._texcoordAttributeLocation);
    }
  
    function Target(pSurface, pWidth, pHeight, pIsDefault, pAttachments) {
      var tContext = pSurface.context;

      var tTargets = pSurface._targets;

      for (var i = 0;; i++) {
        if (tTargets[i] === void 0) {
          tTargets[i] = this;
          this.id = i;
          break;
        }
      }

      if (!pIsDefault) {
        this.glId = tContext.createFramebuffer();
      } else {
        this.glId = null;
      }

      this.width = pWidth;
      this.height = pHeight;
      this.attachments = pAttachments;
    }

    var tProto = WebGLSurface.prototype = Object.create(pSuper.prototype);
    tProto.constructor = WebGLSurface;
  
    tProto._updateProgram = function(pProgram) {
      var tContext = this.context;
      var tWorldMatrix = this.perspectiveMatrix.cloneAndAutoRelease().multiply(pProgram.getSurfaceMatrix());

      tContext.uniformMatrix4fv(this._worldMatrixUniformLocation, false, new Float32Array([
        tWorldMatrix.a,
        tWorldMatrix.b,
        0,
        0,

        tWorldMatrix.c,
        tWorldMatrix.d,
        0,
        0,

        0,
        0,
        -2,
        0,

        tWorldMatrix.e,
        tWorldMatrix.f,
        0,
        1
      ]));
    };

    tProto.enable = function(pFlag) {

    };

    tProto.disable = function(pFlag) {

    };

    tProto.image = function(pImage, pDestRect, pSrcRect, pProgram) {
      throw new Error('image');
    };

    tProto.fastImage = function(pImage, pProgram) {
      if (pImage.constructor !== Texture) {
        throw new Error('Non texture images are not supported in WebGL');
      }

      var tGlTexture = this._textures[pImage.id];
      var tContext = this.context;
      var tBuffer;

      this._updateProgram(pProgram);

      tBuffer = tGlTexture.positionBuffer;
      tContext.bindBuffer(tContext.ARRAY_BUFFER, tBuffer);
      tContext.vertexAttribPointer(
        this._positionAttributeLocation,
        2,
        tContext.UNSIGNED_SHORT,
        false,
        0,
        0
      );

      tContext.activeTexture(tContext.TEXTURE0);
      tContext.bindTexture(tContext.TEXTURE_2D, tGlTexture);
      tContext.uniform1i(this._textureUniformLocation, 0);

      tBuffer = tGlTexture.texCoordsBuffer;
      tContext.bindBuffer(tContext.ARRAY_BUFFER, tBuffer);
      tContext.vertexAttribPointer(
        this._texcoordAttributeLocation,
        2,
        tContext.FLOAT,
        false,
        0,
        0
      );

      tBuffer = tGlTexture.indexBuffer;
      tContext.bindBuffer(tContext.ELEMENT_ARRAY_BUFFER, tBuffer);

      tContext.drawElements(tContext.TRIANGLES, 6, tContext.UNSIGNED_SHORT, 0);

      tContext.bindBuffer(tContext.ARRAY_BUFFER, null);
      tContext.bindBuffer(tContext.ELEMENT_ARRAY_BUFFER, null);
      tContext.bindTexture(tContext.TEXTURE_2D, null);
    };

    tProto.text = function(pText, pStyle, pProgram) {

    };

    tProto.clearColor = function(pColor) {
      var tContext = this.context;
      var tColor = pColor.getRGBA();

      tContext.clearColor(
        tColor[0] / 255,
        tColor[1] / 255,
        tColor[2] / 255,
        tColor[3] / 255
      );

      tContext.clear(tContext.COLOR_BUFFER_BIT);
    };

    tProto.createTarget = function(pWidth, pHeight, pAttachments) {
      return (new Target(this, pWidth, pHeight, false, pAttachments)).id;
    };

    tProto.destroyTarget = function(pId) {
      var tTarget = this._targets[pId];

      if (tTarget !== void 0) {
        this._targets[pId] = void 0;

        this.context.deleteFramebuffer(tTarget.glId);
      }
    };

    tProto.setTarget = function(pId) {
      var tTarget = this._targets[pId];

      if (tTarget !== void 0) {
        this._activeTarget = pId;
      }
    };

    tProto.getTarget = function() {
      return this._activeTarget;
    };

    tProto.target = function(pId) {

    };

    tProto.attachToTarget = function(pId, pAttachments) {

    };

    tProto.getTargetAttachments = function(pId) {

    };

    tProto.getTargetWidth = function(pId) {
      if (this._targets[pId] !== void 0) {
        return this._targets[pId].width;
      }
    };

    tProto.getTargetHeight = function(pId) {
      if (this._targets[pId] !== void 0) {
        return this._targets[pId].height;
      }
    };

    tProto.registerTexture = function(pTexture) {
      var tTextures = this._textures;

      for (var i = 0; ; i++) {
        if (tTextures[i] === void 0) {
          pTexture.id = i;
          tTextures[i] = this.context.createTexture();
          return;
        }
      }
    };

    tProto.setTextureImage = function(pTexture, pImage) {
      var tGlTexture = this._textures[pTexture.id];
      var tContext = this.context;
      var tWidth = pTexture.getWidth();
      var tHeight = pTexture.getHeight();
      var tTextureWidth = 1;
      var tTextureHeight = 1;

      tContext.pixelStorei(tContext.UNPACK_FLIP_Y_WEBGL, false);
      tContext.pixelStorei(tContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      
      tContext.bindTexture(tContext.TEXTURE_2D, tGlTexture);

      if (pImage === null) {
        // create empty texture.
        tContext.texImage2D(
          tContext.TEXTURE_2D, // target
          0, // level
          tContext.RGBA, // internal format
          tWidth,
          tHeight,
          0, // border
          tContext.RGBA, // format
          tContext.UNSIGNED_BYTE, // type
          null // pixels
        );
      } else {
        if (pImage.constructor === Texture) {
          // TODO
          throw Error("Texture to Texture");
          return;
        } else if (pImage.constructor !== DOMImage) {
          pImage = DOMImage.fromImage(pImage);
        }

        var tDOMImage = pImage.domImage;

        tContext.texImage2D(
          tContext.TEXTURE_2D, // target
          0, // level
          tContext.RGBA, // internal format
          tContext.RGBA, // format
          tContext.UNSIGNED_BYTE, // type
          tDOMImage
        );

        tTextureWidth = tWidth / tDOMImage.width;
        tTextureHeight = tHeight / tDOMImage.height;
      }

      tContext.texParameteri(
        tContext.TEXTURE_2D,
        tContext.TEXTURE_MIN_FILTER,
        tContext.LINEAR
      );

      tContext.texParameteri(
        tContext.TEXTURE_2D,
        tContext.TEXTURE_MAG_FILTER,
        tContext.LINEAR
      );

      tContext.texParameteri(
        tContext.TEXTURE_2D,
        tContext.TEXTURE_WRAP_S,
        tContext.CLAMP_TO_EDGE
      );

      tContext.texParameteri(
        tContext.TEXTURE_2D,
        tContext.TEXTURE_WRAP_T,
        tContext.CLAMP_TO_EDGE
      );

      //tContext.generateMipmap(tContext.TEXTURE_2D);

      // Make mipmaps?
      
      var tBuffer = tContext.createBuffer();
      tContext.bindBuffer(tContext.ARRAY_BUFFER, tBuffer);
      tContext.bufferData(tContext.ARRAY_BUFFER, new Float32Array([
        0, 0,
        0, tTextureHeight,
        tTextureWidth, 0,
        tTextureWidth, tTextureHeight
      ]), tContext.STATIC_DRAW);

      tGlTexture.texCoordsBuffer = tBuffer;

      tBuffer = tContext.createBuffer();
      tContext.bindBuffer(tContext.ARRAY_BUFFER, tBuffer);
      tContext.bufferData(tContext.ARRAY_BUFFER, new Uint16Array([
        0, 0,
        0, tHeight,
        tWidth, 0,
        tWidth, tHeight
      ]), tContext.STATIC_DRAW);

      tGlTexture.positionBuffer = tBuffer;

      tBuffer = tContext.createBuffer();
      tContext.bindBuffer(tContext.ELEMENT_ARRAY_BUFFER, tBuffer);
      tContext.bufferData(tContext.ELEMENT_ARRAY_BUFFER, new Uint16Array([
        0, 1, 2,
        1, 2, 3
      ]), tContext.STATIC_DRAW);

      tGlTexture.indexBuffer = tBuffer;

      tContext.bindBuffer(tContext.ARRAY_BUFFER, null);
      tContext.bindBuffer(tContext.ELEMENT_ARRAY_BUFFER, null);
      tContext.bindTexture(tContext.TEXTURE_2D, null);
    };

    tProto.setTextureBytes = function(pTexture, pBytes, pX, pY, pWidth, pHeight, pStride) {
      throw new Error('setTextureBytes');
    };

    tProto.getTextureBytes = function(pTexture, pX, pY, pWidth, pHeight, pStride) {
      throw new Error('getTextureBytes');
    };

    tProto.destroyTexture = function(pTexture) {
      var tId = pTexture.id;

      if (tId === -1) {
        return;
      }

      var tContext = this.context;
      var tGlTexture = this._textures[tId];
      tContext.deleteBuffer(tGlTexture.texCoordsBuffer);
      tContext.deleteTexture(tGlTexture);

      this._textures[tId] = void 0;
    };

    tProto.render = function(
      pVerticies,
      pFillType,
      pFillData,
      pProgram) {

    };

    tProto.getImage = function(pId) {
      if (pId === 0) {
        return this.image;
      }

      var tTarget = this._targets[pId];

      if (tTarget !== void 0) {
        throw new Error('getImage non 0');
      }

      return null;
    };

    tProto.destroy = function() {
      var i, il;
      var tTargets = this._targets;

      this.context = null;
      this.canvas = null;

      for (i = 1, il = tTargets.length; i < il; i++) {
        if (tTargets[i] !== void 0) {
          this.destroyTarget(i);
        }
      }

      var tTextures = this._textures;

      for (i = 0, il = tTextures.length; i < il; i++) {
        if (tTextures[i] !== void 0) {
          tTextures[i].destroy();
        }
      }

      this._targets = null;
      this._textures = null;
    };

    return WebGLSurface;
  })(benri.graphics.Surface);

  benri.impl.add('graphics.surface', function(pData) {
    pData.add(WebGLSurface, 9);
  });

  benri.impl.web.graphics.WebGLSurface = WebGLSurface;

}(this));
*/
/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';function m(b){throw b;}var n=void 0,r=this;function s(b,d){var a=b.split("."),c=r;!(a[0]in c)&&c.execScript&&c.execScript("var "+a[0]);for(var f;a.length&&(f=a.shift());)!a.length&&d!==n?c[f]=d:c=c[f]?c[f]:c[f]={}};var u="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array;function v(b){var d=b.length,a=0,c=Number.POSITIVE_INFINITY,f,e,g,h,k,l,q,p,t;for(p=0;p<d;++p)b[p]>a&&(a=b[p]),b[p]<c&&(c=b[p]);f=1<<a;e=new (u?Uint32Array:Array)(f);g=1;h=0;for(k=2;g<=a;){for(p=0;p<d;++p)if(b[p]===g){l=0;q=h;for(t=0;t<g;++t)l=l<<1|q&1,q>>=1;for(t=l;t<f;t+=k)e[t]=g<<16|p;++h}++g;h<<=1;k<<=1}return[e,a,c]};function w(b,d){this.g=[];this.h=32768;this.d=this.f=this.a=this.l=0;this.input=u?new Uint8Array(b):b;this.m=!1;this.i=x;this.r=!1;if(d||!(d={}))d.index&&(this.a=d.index),d.bufferSize&&(this.h=d.bufferSize),d.bufferType&&(this.i=d.bufferType),d.resize&&(this.r=d.resize);switch(this.i){case y:this.b=32768;this.c=new (u?Uint8Array:Array)(32768+this.h+258);break;case x:this.b=0;this.c=new (u?Uint8Array:Array)(this.h);this.e=this.z;this.n=this.v;this.j=this.w;break;default:m(Error("invalid inflate mode"))}}
var y=0,x=1,z={t:y,s:x};
w.prototype.k=function(){for(;!this.m;){var b=A(this,3);b&1&&(this.m=!0);b>>>=1;switch(b){case 0:var d=this.input,a=this.a,c=this.c,f=this.b,e=n,g=n,h=n,k=c.length,l=n;this.d=this.f=0;e=d[a++];e===n&&m(Error("invalid uncompressed block header: LEN (first byte)"));g=e;e=d[a++];e===n&&m(Error("invalid uncompressed block header: LEN (second byte)"));g|=e<<8;e=d[a++];e===n&&m(Error("invalid uncompressed block header: NLEN (first byte)"));h=e;e=d[a++];e===n&&m(Error("invalid uncompressed block header: NLEN (second byte)"));h|=
e<<8;g===~h&&m(Error("invalid uncompressed block header: length verify"));a+g>d.length&&m(Error("input buffer is broken"));switch(this.i){case y:for(;f+g>c.length;){l=k-f;g-=l;if(u)c.set(d.subarray(a,a+l),f),f+=l,a+=l;else for(;l--;)c[f++]=d[a++];this.b=f;c=this.e();f=this.b}break;case x:for(;f+g>c.length;)c=this.e({p:2});break;default:m(Error("invalid inflate mode"))}if(u)c.set(d.subarray(a,a+g),f),f+=g,a+=g;else for(;g--;)c[f++]=d[a++];this.a=a;this.b=f;this.c=c;break;case 1:this.j(B,C);break;case 2:aa(this);
break;default:m(Error("unknown BTYPE: "+b))}}return this.n()};
var D=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],E=u?new Uint16Array(D):D,F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],G=u?new Uint16Array(F):F,H=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],I=u?new Uint8Array(H):H,J=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],K=u?new Uint16Array(J):J,L=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,
13],M=u?new Uint8Array(L):L,N=new (u?Uint8Array:Array)(288),O,P;O=0;for(P=N.length;O<P;++O)N[O]=143>=O?8:255>=O?9:279>=O?7:8;var B=v(N),Q=new (u?Uint8Array:Array)(30),R,S;R=0;for(S=Q.length;R<S;++R)Q[R]=5;var C=v(Q);function A(b,d){for(var a=b.f,c=b.d,f=b.input,e=b.a,g;c<d;)g=f[e++],g===n&&m(Error("input buffer is broken")),a|=g<<c,c+=8;g=a&(1<<d)-1;b.f=a>>>d;b.d=c-d;b.a=e;return g}
function T(b,d){for(var a=b.f,c=b.d,f=b.input,e=b.a,g=d[0],h=d[1],k,l,q;c<h;){k=f[e++];if(k===n)break;a|=k<<c;c+=8}l=g[a&(1<<h)-1];q=l>>>16;b.f=a>>q;b.d=c-q;b.a=e;return l&65535}
function aa(b){function d(a,b,c){var d,e,f,g;for(g=0;g<a;)switch(d=T(this,b),d){case 16:for(f=3+A(this,2);f--;)c[g++]=e;break;case 17:for(f=3+A(this,3);f--;)c[g++]=0;e=0;break;case 18:for(f=11+A(this,7);f--;)c[g++]=0;e=0;break;default:e=c[g++]=d}return c}var a=A(b,5)+257,c=A(b,5)+1,f=A(b,4)+4,e=new (u?Uint8Array:Array)(E.length),g,h,k,l;for(l=0;l<f;++l)e[E[l]]=A(b,3);g=v(e);h=new (u?Uint8Array:Array)(a);k=new (u?Uint8Array:Array)(c);b.j(v(d.call(b,a,g,h)),v(d.call(b,c,g,k)))}
w.prototype.j=function(b,d){var a=this.c,c=this.b;this.o=b;for(var f=a.length-258,e,g,h,k;256!==(e=T(this,b));)if(256>e)c>=f&&(this.b=c,a=this.e(),c=this.b),a[c++]=e;else{g=e-257;k=G[g];0<I[g]&&(k+=A(this,I[g]));e=T(this,d);h=K[e];0<M[e]&&(h+=A(this,M[e]));c>=f&&(this.b=c,a=this.e(),c=this.b);for(;k--;)a[c]=a[c++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=c};
w.prototype.w=function(b,d){var a=this.c,c=this.b;this.o=b;for(var f=a.length,e,g,h,k;256!==(e=T(this,b));)if(256>e)c>=f&&(a=this.e(),f=a.length),a[c++]=e;else{g=e-257;k=G[g];0<I[g]&&(k+=A(this,I[g]));e=T(this,d);h=K[e];0<M[e]&&(h+=A(this,M[e]));c+k>f&&(a=this.e(),f=a.length);for(;k--;)a[c]=a[c++-h]}for(;8<=this.d;)this.d-=8,this.a--;this.b=c};
w.prototype.e=function(){var b=new (u?Uint8Array:Array)(this.b-32768),d=this.b-32768,a,c,f=this.c;if(u)b.set(f.subarray(32768,b.length));else{a=0;for(c=b.length;a<c;++a)b[a]=f[a+32768]}this.g.push(b);this.l+=b.length;if(u)f.set(f.subarray(d,d+32768));else for(a=0;32768>a;++a)f[a]=f[d+a];this.b=32768;return f};
w.prototype.z=function(b){var d,a=this.input.length/this.a+1|0,c,f,e,g=this.input,h=this.c;b&&("number"===typeof b.p&&(a=b.p),"number"===typeof b.u&&(a+=b.u));2>a?(c=(g.length-this.a)/this.o[2],e=258*(c/2)|0,f=e<h.length?h.length+e:h.length<<1):f=h.length*a;u?(d=new Uint8Array(f),d.set(h)):d=h;return this.c=d};
w.prototype.n=function(){var b=0,d=this.c,a=this.g,c,f=new (u?Uint8Array:Array)(this.l+(this.b-32768)),e,g,h,k;if(0===a.length)return u?this.c.subarray(32768,this.b):this.c.slice(32768,this.b);e=0;for(g=a.length;e<g;++e){c=a[e];h=0;for(k=c.length;h<k;++h)f[b++]=c[h]}e=32768;for(g=this.b;e<g;++e)f[b++]=d[e];this.g=[];return this.buffer=f};
w.prototype.v=function(){var b,d=this.b;u?this.r?(b=new Uint8Array(d),b.set(this.c.subarray(0,d))):b=this.c.subarray(0,d):(this.c.length>d&&(this.c.length=d),b=this.c);return this.buffer=b};function U(b,d){var a,c;this.input=b;this.a=0;if(d||!(d={}))d.index&&(this.a=d.index),d.verify&&(this.A=d.verify);a=b[this.a++];c=b[this.a++];switch(a&15){case V:this.method=V;break;default:m(Error("unsupported compression method"))}0!==((a<<8)+c)%31&&m(Error("invalid fcheck flag:"+((a<<8)+c)%31));c&32&&m(Error("fdict flag is not supported"));this.q=new w(b,{index:this.a,bufferSize:d.bufferSize,bufferType:d.bufferType,resize:d.resize})}
U.prototype.k=function(){var b=this.input,d,a;d=this.q.k();this.a=this.q.a;if(this.A){a=(b[this.a++]<<24|b[this.a++]<<16|b[this.a++]<<8|b[this.a++])>>>0;var c=d;if("string"===typeof c){var f=c.split(""),e,g;e=0;for(g=f.length;e<g;e++)f[e]=(f[e].charCodeAt(0)&255)>>>0;c=f}for(var h=1,k=0,l=c.length,q,p=0;0<l;){q=1024<l?1024:l;l-=q;do h+=c[p++],k+=h;while(--q);h%=65521;k%=65521}a!==(k<<16|h)>>>0&&m(Error("invalid adler-32 checksum"))}return d};var V=8;s("Zlib.Inflate",U);s("Zlib.Inflate.prototype.decompress",U.prototype.k);var W={ADAPTIVE:z.s,BLOCK:z.t},X,Y,Z,$;if(Object.keys)X=Object.keys(W);else for(Y in X=[],Z=0,W)X[Z++]=Y;Z=0;for($=X.length;Z<$;++Z)Y=X[Z],s("Zlib.Inflate.BufferType."+Y,W[Y]);}).call(this); //@ sourceMappingURL=inflate.min.js.map
