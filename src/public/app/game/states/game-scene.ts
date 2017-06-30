/// <reference path='../_references.ts' />

import GameObjects = GameApp.Models;

import Level = GameObjects.Level;
import Swap = GameObjects.Swap;
import IJsonLevel = GameObjects.IJsonLevel;
import Cookie = GameObjects.Cookie;
import Chain = GameObjects.Chain;
import GameConfig = GameObjects.Config;

/*croissant = 1,
cupcake = 2,
danish = 3,
donut = 4,
macaroon = 5,
sugarCookie = 6*/

//Conteo de explosiones personajes
var countCroissant = 0;
var countCupcake = 0;
var countDanish = 0;
var countDonut = 0;
var countMacaroon = 0;
var countSugarCookie = 0;

//Bandera conteo personajes (evita repeticiones)
var flagCroissant = 0;
var flagCupcake = 0;
var flagDanish = 0;
var flagDonut = 0;
var flagMacaroon = 0;
var flagSugarCookie = 0;

//Numero de explosiones por dificultad de lvl
var explosionCroissant = 0;
var explosionCupcake = 0;
var explosionDanish = 0;
var explosionDonut = 0;
var explosionMacaroon = 0;
var explosionSugarCookie = 0;

var lvlComplete;
//var levelGame = (this.gameTimer.game.state.states['GameScene'].levelNumber)+1;
var levelGame ;
var positionImage = 200;
var updateCroissant=0 , updateCupcake=0, updateDanish=0, updateDonut=0, updateMacaroon=0;



module GameApp.States {
   'use strict';

   export class GameScene extends Phaser.State {

      tileWidth: number = 64.0;
      tileHeight: number = 72.0;
      marginYDelta: number = 50;

      level: GameObjects.Level;

      cookieLayer: Phaser.Group;
      tilesLayer: Phaser.Group;

      swipeFromColumn: number;
      swipeFromRow: number;
      
      isPossibleSwap:boolean = false;
      userInteractionEnabled: boolean;

      swapSound: Phaser.Sound;
      invalidSwapSound: Phaser.Sound;
      matchSound: Phaser.Sound;
      fallingCookieSound: Phaser.Sound;
      addCookieSound: Phaser.Sound;
      
      gameTimer: GameTimer;
      
      levelText: Phaser.Text;

      score: number;
      scoreText: Phaser.Text;
      scoreLabel: Phaser.Text;

      newGameButton: Phaser.Button;

      countCroissantImage: Phaser.Text; //Sterben
      countCupcakeImage: Phaser.Text; //Sterben
      countDanishImage: Phaser.Text; //Sterben
      countDonutImage: Phaser.Text; //Sterben
      countMacaroonImage: Phaser.Text; //Sterben
      scoreImage: Phaser.Image; //sterben

      create() {
         levelGame = 1;
         var levelNumber: number = this.game.state.states['GameScene'].levelNumber;
            /*INI STERBEN*/
            this.numberExplosions(levelNumber+1);
            var msjNewLevel = 'Comencemos!! Tienes que destruir';
            if(explosionCroissant>0)
                  msjNewLevel = msjNewLevel+' '+explosionCroissant+' Croissant (los panes weon)';
            
            if(explosionCupcake>0)
                  msjNewLevel = msjNewLevel+', '+explosionCupcake+' Cupcake (la wea roja)';
            
            if(explosionDanish>0)
                  msjNewLevel = msjNewLevel+', '+explosionDanish+' Danish (el azulito)';

            if(explosionDonut>0)
                  msjNewLevel = msjNewLevel+', '+explosionDonut+' Donut';

            if(explosionMacaroon>0)
                  msjNewLevel = msjNewLevel+', '+explosionMacaroon+' Macaroon (las chuchitas verdes)';

            if(explosionSugarCookie>0)
                  msjNewLevel = msjNewLevel+', '+explosionSugarCookie+' SugarCookie (la estrella)';
            
            console.log('/********************************************************/');
            console.log(msjNewLevel);
            console.log('/********************************************************/');      
         /*FIN STERBEN*/

         var bg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bg');
         bg.anchor.setTo(0.5, 0.5);

         this.game.sound.stopAll(); //sterben
         //this.game.sound.play('bgMusic');
         
         this.createLevelText(levelNumber + 1);
         
         this.initScore();
         this.createScoreText();

         
         if(explosionCroissant>0){
               this.createCountImage('Croissant',positionImage); //sterben
               positionImage -= 50;
         }
            
         if(explosionCupcake>0){
               this.createCountImage('Cupcake',positionImage);
               positionImage -= 50;
         }
            
         if(explosionDanish>0){
               this.createCountImage('Danish',positionImage);
               positionImage -= 50;
         }
            
         if(explosionDonut>0){
               this.createCountImage('Donut',positionImage);
               positionImage -= 50;
         }
            
         if(explosionMacaroon>0){
               this.createCountImage('Macaroon',positionImage);
               positionImage -= 50;
         }
            

         //this.createNewGameButton();
         
         this.swapSound = this.game.add.audio('swapSound');
         this.invalidSwapSound = this.game.add.audio('invalidSwapSound');
         this.matchSound = this.game.add.audio('matchSound');
         this.fallingCookieSound = this.game.add.audio('fallingCookieSound');
         this.addCookieSound = this.game.add.audio('addCookieSound');
         
         this.gameTimer = new GameTimer(this.game);
         this.gameTimer.createTimer();

         this.game.input.addMoveCallback(this.touchesMoved, this);
         
         
         this.initLevel('level'+levelNumber);
         this.beginGame();

      }
      
      private initScore() {
         var scoreFromState = this.game.state.states['GameScene'].score;
         if(scoreFromState != null){
            this.score =  scoreFromState;
         }
         else{
            this.score =  0;
         }
      }

      private createCountImage(namePj,separador){
            var posX = 70+separador;
            var assets = 'app/game/assets/';
            var numberExplosion;

            this.game.load.image(namePj, assets+namePj+'.png')
            this.scoreImage = this.game.add.image(this.game.world.centerX+posX, 16 , namePj);
            this.scoreImage.width = 25;
            this.scoreImage.height = 28;
            //this.scoreLabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
            
            if(namePj == 'Croissant'){
                  this.countCroissantImage = this.game.add.text(this.game.world.centerX+posX+4, 40 , ""+explosionCroissant , { //sterben
                  font: "Sans Serif",
                  fill: "white",
                  fontSize: 30
                  });
                  this.countCroissantImage.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
            }

            if(namePj == 'Cupcake'){
                  this.countCupcakeImage = this.game.add.text(this.game.world.centerX+posX+4, 40 , ""+explosionCupcake , { //sterben
                  font: "Gill Sans Bold",
                  fill: "white",
                  fontSize: 30
                  });
                  this.countCupcakeImage.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
            }

            if(namePj == 'Danish'){
                  this.countDanishImage = this.game.add.text(this.game.world.centerX+posX+4, 40 , ""+explosionDanish , { //sterben
                  font: "Gill Sans Bold",
                  fill: "white",
                  fontSize: 30
                  });
                  this.countDanishImage.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
            }

            if(namePj == 'Donut'){
                  this.countDonutImage = this.game.add.text(this.game.world.centerX+posX+4, 40 , ""+explosionDonut , { //sterben
                  font: "Gill Sans Bold",
                  fill: "white",
                  fontSize: 30
                  });
                  this.countDonutImage.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
            }

            if(namePj == 'Macaroon'){
                  this.countMacaroonImage = this.game.add.text(this.game.world.centerX+posX+4, 40 , ""+explosionMacaroon , { //sterben
                  font: "Gill Sans Bold",
                  fill: "white",
                  fontSize: 30
                  });
                  this.countMacaroonImage.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
            }
            
         
      }

      private updateCountImage(namePj,separador){
            var posX = 70+separador;
            var assets = 'app/game/assets/';
            var numberExplosion;

            this.game.load.image(namePj, assets+namePj+'.png')
            this.scoreImage = this.game.add.image(this.game.world.centerX+posX, 16 , namePj);
            this.scoreImage.width = 25;
            this.scoreImage.height = 28;
      }

      private createLevelText(levelNumber){
         //var levelLabel = this.game.add.text(550, 20, "Level:", {
         //var levelLabel = this.game.add.text(this.game.world.centerX-40, 20, "NIVEL:", {  //sterben
         var levelLabel = this.game.add.text(this.game.world.centerX-270, 680, "NIVEL:", {  //sterben
            //font: "Gill Sans Bold", 
            font: "Sans Serif", 
            fill: "white",
            align: "center",
            fontSize: 28
         });
         levelLabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
        //var levelText = this.game.add.text(550, 40, ""+levelNumber, { 
        //this.levelText = this.game.add.text(this.game.world.centerX-40, 40, ""+levelNumber, {  //sterben
          this.levelText = this.game.add.text(this.game.world.centerX-170, 680, ""+levelNumber, {  //sterben
            font: "Sans Serif",
            fill: "white",
            align: "center",
            fontSize: 30
         });
         this.levelText.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
      }
      
      private createScoreText(){ 
         //this.scoreLabel = this.game.add.text(this.game.world.centerX, 20 , "Score:" , {
         //this.scoreLabel = this.game.add.text(this.game.world.centerX-150, 20 , "Score:" , {  //sterben
           this.scoreLabel = this.game.add.text(this.game.world.centerX-270, 715, "PUNTAJE:" , {  //sterben
            font: "Sans Serif",
            fill: "white",
            fontSize: 28
         });
         this.scoreLabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
         //this.scoreText = this.game.add.text(this.game.world.centerX, 40 , ""+this.score , {
         //this.scoreText = this.game.add.text(this.game.world.centerX-150, 40 , ""+this.score , { //sterben
           this.scoreText = this.game.add.text(this.game.world.centerX-140, 715, ""+this.score , { //sterben
            font: "Gill Sans Bold",
            fill: "white",
            fontSize: 30
         });
         this.scoreText.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
      }

      private createNewGameButton(){
         var assets = 'app/game/assets/';
         this.game.load.spritesheet('boton', assets+'Danish@2x.png',64,72);

         //this.scoreLabel = this.game.add.text(this.game.world.centerX, 20 , "Score:" , {
         this.scoreLabel = this.game.add.text(this.game.world.centerX, 750 , "¿Jugar de nuevo?" , {  //sterben
            font: "Gill Sans Bold",
            fill: "white",
            fontSize: 30
         });
         this.scoreLabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
         
         //this.scoreText = this.game.add.text(this.game.world.centerX, 40 , ""+this.score , {
         this.newGameButton = this.game.add.button(this.game.world.centerX+250, 750 , 'boton', this.actionOnClick, this, 2, 1, 0); 
         //this.newGameButton.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
      }

      actionOnClick(){
            console.log('Juguemos de nuevo');
            this.game.state.states['GameScene'].levelNumber = 0;
            this.game.state.states['GameScene'].score = 0;
            this.game.state.restart();

            //this.game.state.start('GameScene', true, false);
            //this.create();
      }
      
      private updateScoreText(){
         this.scoreText.text = ""+this.score;
      }

      //Reducir el score de las explosiones de cada pj  //sterben
      private updateCountTextImage(namePj,value){
            if(namePj == 'Croissant')
                  this.countCroissantImage.text = ""+((explosionCroissant >= value)?(explosionCroissant-value):0);

            if(namePj == 'Cupcake')
                  this.countCupcakeImage.text = ""+((explosionCupcake >= value)?(explosionCupcake-value):0);

            if(namePj == 'Danish')
                  this.countDanishImage.text = ""+((explosionDanish >= value)?(explosionDanish-value):0);

            if(namePj == 'Donut')
                  this.countDonutImage.text = ""+((explosionDonut >= value)?(explosionDonut-value):0);

            if(namePj == 'Macaroon')
                  this.countMacaroonImage.text = ""+((explosionMacaroon >= value)?(explosionMacaroon-value):0);
         
      }

      private initLevel(levelName: string) {
         var levelData: IJsonLevel = this.game.cache.getJSON(levelName);
         
         if(levelData == null)
         {
            throw 'Cannot load level data';
         }
         
         //var gameConfig = new GameConfig(9, 9, 6);
         var gameConfig = new GameConfig(9, 8, 6);
         this.level = new Level(gameConfig);
         this.level.initWithData(levelData);
         this.addTiles();
      }
      
      render() {
         this.gameTimer.renderTimer();
      }


      beginGame() {
         this.userInteractionEnabled = true;
         this.shuffle();
      }

      shuffle() {

         var cookies: Cookie[] = this.level.shuffle();
         this.addSpritesForCookies(cookies);
      }

      addSpritesForCookies(cookies: Cookie[]) {

         this.cookieLayer = this.game.add.group();
         this.cookieLayer.z = 2;
         

         cookies.forEach((cookie: Cookie) => {
            var point = this.pointForCookie(cookie.column, cookie.row);
            var createdCookie = this.cookieLayer.create(point.x, point.y, cookie.spriteName());
            createdCookie.inputEnabled = true;
            createdCookie.events.onInputDown.add(this.touchesBegan, this);
            createdCookie.events.onInputUp.add(this.touchesEnd, this);
            cookie.sprite = createdCookie;
         })
      }

      pointForCookie(column: number, row: number): Phaser.Point {
         var x = column * this.tileWidth + this.tileWidth / 2;
         var y = (row * this.tileHeight + this.tileHeight / 2) + this.marginYDelta;
         
         return new Phaser.Point(x, y);
      }

      convertPoint(point: Phaser.Point, cookiePosition: GameObjects.ICookiePosition): boolean {

         var x = point.x - 32;
         var y = point.y - 32 - this.marginYDelta;
         
         if (x >= 0 && x < this.level.config.numColumns * this.tileWidth &&
            y >= 0 && y < this.level.config.numRows * this.tileHeight) {

            cookiePosition.column = Phaser.Math.floor(x / this.tileWidth);
            cookiePosition.row = Phaser.Math.floor((y) / this.tileHeight);

            return true;
         }
         else {
            return false;
         }

      } 

      addTiles() {
         this.tilesLayer = this.game.add.group();
         this.tilesLayer.z = 1;

         for (var row: number = 0; row < this.level.config.numColumns; row++) {
            for (var column: number = 0; column < this.level.config.numColumns; column++) {
               if (this.level.tileAtColumn(column, row) != null) {
                  var point = this.pointForCookie(column, row);
                  this.tilesLayer.create(point.x, point.y, 'Tile');
               }
            }
         }
      }
      
      debugMove(x, y){
         var cookiePosition: GameObjects.ICookiePosition = {
               column: null,
               row: null
         }
         var convert = this.convertPoint(new Phaser.Point(x, y), cookiePosition);
         
         if(convert){
            var cookie = this.level.cookieAtPosition(cookiePosition.column, cookiePosition.row);
            /*if(cookie){
               console.log('actual cookie', {
               column: cookie.column,
               row: cookie.row
            })
            }*/
            
         }
        //console.log('movimientox2');
        //console.log('x-'+x+' y-'+y);
         //console.log('cookie point', cookiePosition);
      }
      touchesMoved(pointer: Phaser.Pointer, x, y, fromClick) {
         
         this.debugMove(x, y);
         
         if (this.swipeFromColumn == null) return;

         if (pointer.isDown) {

            var cookiePosition: GameObjects.ICookiePosition = {
               column: null,
               row: null
            }
            //TODO: need to configure this sizes
            
            if (this.convertPoint(new Phaser.Point(x, y), cookiePosition)) {

               var horzDelta: number = 0,
                  vertDelta: number = 0;

               if (cookiePosition.column < this.swipeFromColumn) { // swipe left
                  horzDelta = -1;
               } else if (cookiePosition.column > this.swipeFromColumn) { // swipe right
                  horzDelta = 1;
               } else if (cookiePosition.row < this.swipeFromRow) { // swipe down
                  vertDelta = -1;
               } else if (cookiePosition.row > this.swipeFromRow) { // swipe up
                  vertDelta = 1;
               }

               if (horzDelta != 0 || vertDelta != 0) {
                  this.trySwapHorizontal(horzDelta, vertDelta);

                  this.swipeFromColumn = null;
               }
            }
         }

      }

      touchesBegan(selectedCookie: Phaser.Sprite, pointer: Phaser.Pointer) {
         var cookiePosition: GameObjects.ICookiePosition = {
            column: null,
            row: null
         }
         
         if (this.convertPoint(selectedCookie.position, cookiePosition)) {
            if (this.level.cookieAtPosition(cookiePosition.column, cookiePosition.row)) {
               this.swipeFromColumn = cookiePosition.column;
               this.swipeFromRow = cookiePosition.row;
            }

            //console.log('selectedCookie', 'column: ' + cookiePosition.column + ' row: ' + cookiePosition.row);
         }

         else {
            this.swipeFromColumn = null;
            this.swipeFromRow = null;
         }
      }

      touchesEnd(selectedCookie: Phaser.Sprite, pointer: Phaser.Pointer) {
         this.swipeFromColumn = this.swipeFromRow = null;
         //console.log('releaseCookie', selectedCookie);
         //console.log('up from', selectedGem);
         //console.log('touchesEnd pointer', pointer.position);
         
         if(this.isPossibleSwap){ 
            this.handleMatches();
         }
         
         
         this.userInteractionEnabled = true;
      }
      
      trySwapHorizontal(horzDelta: number, vertDelta: number) {
            console.log('trySwapHorizontal'); //sterben

         this.userInteractionEnabled = false;

         var toColumn = this.swipeFromColumn + horzDelta;
         var toRow = this.swipeFromRow + vertDelta;

         if (toColumn < 0 || toColumn >= this.level.config.numColumns) return;
         if (toRow < 0 || toRow >= this.level.config.numRows) return;

         var toCookie: Cookie = this.level.cookieAtPosition(toColumn, toRow);
         if (!toCookie) return;

         var fromCookie = this.level.cookieAtPosition(this.swipeFromColumn, this.swipeFromRow);

         var swap = new Swap();
         swap.cookieA = fromCookie;
         swap.cookieB = toCookie;

         if (this.level.isPossibleSwap(swap)) {
            this.userInteractionEnabled = true;
            this.level.performSwap(swap);
            this.animateSwap(swap);
            this.isPossibleSwap = true;
            console.log('Good swap');
         }
         else {
            this.userInteractionEnabled = true;
            this.animateInvalidSwap(swap);
            this.isPossibleSwap = false;
            console.log('Bad swap');

         }

      }

      handleMatches() {
         var chains = this.level.removeMatches();
         //console.log('handleMatches-removeMatches'); //sterben
         
         if(chains.length == 0){
            this.beginNextTurn();
            return;
         }
         
         this.animateMatchedCookies(chains);
         this.updateScore(chains);
         
         var columns = this.level.fillHoles();
         this.animateFallingCookies(columns);
         
         var newColumns = this.level.topUpCookies();
         
         this.animateNewCookies(newColumns, () => {
            this.handleMatches();
         });

      }
      
      private updateScore(chains: Chain[]){
         chains.forEach((chain) => {
            this.score += chain.score;   
         });
         
         this.updateScoreText();
      }
      
      private beginNextTurn(){
         this.userInteractionEnabled = true;
      }

      animateSwap(swap: Swap) {

         var cookieSrpiteA = swap.cookieA.sprite,
            cookieSrpiteB = swap.cookieB.sprite;

         var tween = this.game.add.tween(swap.cookieA.sprite).to({ x: cookieSrpiteB.position.x, y: cookieSrpiteB.position.y }, 100, Phaser.Easing.Linear.None, true);
         var tween2 = this.game.add.tween(swap.cookieB.sprite).to({ x: cookieSrpiteA.position.x, y: cookieSrpiteA.position.y }, 100, Phaser.Easing.Linear.None, true);

         tween.onComplete.add(() => {
            console.log('tween complete');

            this.swapSound.play();

            this.userInteractionEnabled = true;
         }, this);

      }

      animateInvalidSwap(swap: Swap) {
         var cookieSrpiteA = swap.cookieA.sprite,
            cookieSrpiteB = swap.cookieB.sprite;

         var tween = this.game.add.tween(swap.cookieA.sprite).to({ x: cookieSrpiteB.position.x, y: cookieSrpiteB.position.y }, 100, Phaser.Easing.Linear.None, true);
         var tween2 = this.game.add.tween(swap.cookieB.sprite).to({ x: cookieSrpiteA.position.x, y: cookieSrpiteA.position.y }, 100, Phaser.Easing.Linear.None, true);

         tween2.onComplete.add(() => {
            var tweenBack = this.game.add.tween(swap.cookieB.sprite).to({ x: cookieSrpiteA.position.x, y: cookieSrpiteA.position.y }, 100, Phaser.Easing.Linear.None, true);
            var tweenBack2 = this.game.add.tween(swap.cookieA.sprite).to({ x: cookieSrpiteB.position.x, y: cookieSrpiteB.position.y }, 100, Phaser.Easing.Linear.None, true);

            this.invalidSwapSound.play();

         }, this);
      }

      animateMatchedCookies(chains: Chain[]) {

         chains.forEach((chain) => {
            this.animateScoreForChain(chain);
            flagCroissant = 0;
            flagCupcake = 0;
            flagDanish = 0;
            flagDonut = 0;
            flagMacaroon = 0;
            flagSugarCookie = 0;
            var levelComplete = 'N';

            chain.cookies.forEach((cookie) => {
               // 1        
               if (cookie.sprite != null) {
 
                  // 2
                  cookie.sprite.kill();
                  this.matchSound.play();
                  
                  console.log('levelGame: '+ levelGame);
                  if(explosionCroissant>0) updateCroissant = 1;
                  if(explosionCupcake>0) updateCupcake = 1;
                  if(explosionDanish>0) updateDanish = 1;
                  if(explosionDonut>0) updateDonut = 1;
                  if(explosionMacaroon>0) updateMacaroon = 1;

                  this.difficultyLevel(cookie.cookieType, levelGame, function(lvlComplete){
                        levelComplete = lvlComplete;
                  });

                  if (levelComplete == 'S'){
                        levelGame = levelGame+1;
                        var realTime = Math.round((this.gameTimer.timerEvent.delay - this.gameTimer.timer.ms) / 1000)*1000;
                        var extraTime = 20000;
                        //Agrego tiempo por pasar dificultad
                        this.gameTimer.updateTimer(); 

                        //Seteo las variables con el numero de explosiones del siguiente lvl
                        this.numberExplosions(levelGame);

                        //Creo o Actualizo en la pantalla la nueva cantidad de explosiones
                        //1
                        if(updateCroissant==1){
                              this.countCroissantImage.setText(String(explosionCroissant));
                        }
                        else if(explosionCroissant>0){
                              this.createCountImage('Croissant',positionImage); //sterben
                              positionImage -= 50;
                        }
                        //2
                        if(updateCupcake==1){
                              this.countCupcakeImage.setText(String(explosionCupcake));
                        }
                        else if(explosionCupcake>0){
                              this.createCountImage('Cupcake',positionImage); //sterben
                              positionImage -= 50;
                        }
                        //3
                        if(updateDanish==1){
                              this.countDanishImage.setText(String(explosionDanish));
                        }
                        else if(explosionDanish>0){
                              this.createCountImage('Danish',positionImage); //sterben
                              positionImage -= 50;
                        }
                        //4
                        if(updateDonut==1){
                              this.countDonutImage.setText(String(explosionDonut));
                        }
                        else if(explosionDonut>0){
                              this.createCountImage('Donut',positionImage); //sterben
                              positionImage -= 50;
                        }
                        //5
                        if(updateMacaroon==1){
                              this.countMacaroonImage.setText(String(explosionMacaroon));
                        }
                        else if(explosionMacaroon>0){
                              this.createCountImage('Macaroon',positionImage); //sterben
                              positionImage -= 50;
                        }

                        // this.countCroissantImage.setText(String(explosionCroissant));
                        // this.countCupcakeImage.setText(String(explosionCupcake));
                        // this.countDanishImage.setText(String(explosionDanish));
                        // this.countDonutImage.setText(String(explosionDonut));
                        // this.countMacaroonImage.setText(String(explosionMacaroon));

                        //Actualizo el nuevo numero de lvl alcanzado
                        this.levelText.setText(String(levelGame));
                  }
                  // 3
                  cookie.sprite = null;
               }
            });
         });

      }

      //Retos a completar por lvl/dificultad
      numberExplosions(numLevel){
            if(numLevel == 1){

                  explosionCroissant = 0;
                  explosionCupcake = 1;
                  explosionDanish = 0;
                  explosionDonut = 0;
                  explosionMacaroon = 0;
                  explosionSugarCookie = 0;
            }else if(numLevel == 2){

                  explosionCroissant = 1;
                  explosionCupcake = 2;
                  explosionDanish = 0;
                  explosionDonut = 0;
                  explosionMacaroon = 0;
                  explosionSugarCookie = 0;
            }else if (numLevel == 3){

                  explosionCroissant = 2;
                  explosionCupcake = 2;
                  explosionDanish = 0;
                  explosionDonut = 2;
                  explosionMacaroon = 0;
                  explosionSugarCookie = 0;            
            }else{
                  explosionCroissant = 3;
                  explosionCupcake = 3;
                  explosionDanish = 3;
                  explosionDonut = 3;
                  explosionMacaroon = 3;
                  explosionSugarCookie = 3;  
            }
      }

      difficultyLevel(cookieType, numLevel, callback){
            var lvlComplete = 'N';
            var msjNewLevel;
            //obtengo el numero de explosiones a realizar por cada personaje
            this.numberExplosions(numLevel);

            //Conteo de cookies explotadas
            /*croissant = 1,
            cupcake = 2,
            danish = 3,
            donut = 4,
            macaroon = 5,
            sugarCookie = 6*/

            if(cookieType == 1){
                  //flagCroissant : para contar una sola vez la explocion y no cuente la cantidad de personajes
                  if(flagCroissant == 0  && updateCroissant==1){
                        countCroissant = countCroissant+1;
                        this.updateCountTextImage('Croissant',countCroissant);
                        //if(countCroissant==explosionCroissant)
                        //      this.updateCountImage('Croissant_bn',0);
                        console.log('countCroissant: '+countCroissant); //sterben2
                        flagCroissant = 1;
                  }
            }

            if(cookieType == 2){
                  if(flagCupcake == 0 && updateCupcake==1){
                        countCupcake = countCupcake+1;
                        this.updateCountTextImage('Cupcake',countCupcake);
                        // if(countCroissant==explosionCroissant)
                        //       this.updateCountImage('Cupcake_bn',50);
                        console.log('countCupcake: '+countCupcake); //sterben2
                        flagCupcake = 1;
                  }
            }

            if(cookieType == 3){
                  if(flagDanish == 0 && updateDanish==1){
                        countDanish = countDanish+1;
                        this.updateCountTextImage('Danish',countDanish);
                        console.log('countDanish: '+countDanish); //sterben2
                        flagDanish = 1;
                  }
            }

            if(cookieType == 4){
                  if(flagDonut == 0 && updateDonut==1){
                        countDonut = countDonut+1;
                        this.updateCountTextImage('Donut',countDonut);
                        console.log('countDonut: '+countDonut); //sterben2
                        flagDonut = 1;
                  }
            }

            if(cookieType == 5){
                  if(flagMacaroon == 0 && updateMacaroon==1){
                        countMacaroon = countMacaroon+1;
                        this.updateCountTextImage('Macaroon',countMacaroon);
                        console.log('countMacaroon: '+countMacaroon); //sterben2
                        flagMacaroon = 1;
                  }
            }

            if(cookieType == 6){
                  if(flagSugarCookie == 0){
                        countSugarCookie = countSugarCookie+1;
                        console.log('countSugarCookie: '+countSugarCookie); //sterben2
                        flagSugarCookie = 1;
                  }
            }

            if (countCroissant >= explosionCroissant && 
                countCupcake >= explosionCupcake &&
                countDanish >= explosionDanish &&
                countDonut >= explosionDonut &&
                countMacaroon >= explosionMacaroon &&
                countSugarCookie >= explosionSugarCookie){
                  //seteo con 0 el contador de los personajes, comienza nuevo lvl
                  countCroissant = 0;
                  countCupcake = 0;
                  countDanish = 0;
                  countDonut = 0;
                  countMacaroon = 0;
                  countSugarCookie = 0;

                  console.log('FELICITACIONES HAS COMPLETADO EL NIVEL: '+ numLevel);

                  lvlComplete = 'S';
            }
            callback(lvlComplete);

      }
      
      
      animateFallingCookies(columns: any[]){
         
         var longestDuration = 0;
         
         columns.forEach((cookies: Cookie[]) => {
            var count = 0;
            cookies.forEach((cookie: Cookie) => {
               count++;
               
               var newPosition = this.pointForCookie(cookie.column, cookie.row);
               
               var delay = 0.05 + 0.15 * count*500;
               
               var duration = ((cookie.sprite.position.y - newPosition.y) / this.tileHeight) * 100;
               
               longestDuration = Math.max(longestDuration, duration + delay);
               
               var tween = this.game.add.tween(cookie.sprite).to({ x: newPosition.x, y: newPosition.y }, duration, Phaser.Easing.Linear.None, true, delay);
               
               tween.onComplete.add(() => {
                  //console.log('animateFallingCookies complete', duration);
                  this.fallingCookieSound.play();
               });
               
            });
         });
         
      }
      
      
      animateNewCookies(columns: any[], onComplete){
         
         var longestDuration = 0;
         var tweens: Phaser.Tween[] = [];
         
         columns.forEach((cookies: Cookie[]) => {
            var idx = 0;
            
            var startRow = cookies[0].row + 1;
            var cookiesCount = cookies.length;
            
            cookies.forEach((cookie: Cookie) => {
               idx++;

               //console.log('spriteNameNews:'+cookie.spriteName()); //sterben
               
               var point = this.pointForCookie(cookie.column, startRow);
               var createdCookie: Phaser.Sprite = this.cookieLayer.create(point.x, point.y, cookie.spriteName());
               createdCookie.inputEnabled = true;
               createdCookie.events.onInputDown.add(this.touchesBegan, this);
               createdCookie.events.onInputUp.add(this.touchesEnd, this);
               cookie.sprite = createdCookie;
               
               var delay = 0.1 + 0.2 * (cookiesCount - idx - 1) * 150;
               
               var duration = (startRow - cookie.row) * 100;
               longestDuration = Math.max(longestDuration, duration + delay);
               
               var newPoint = this.pointForCookie(cookie.column, cookie.row);
               createdCookie.alpha = 0;
               
               var tween = this.game.add.tween(createdCookie).to({ x: newPoint.x, y: newPoint.y, alpha: 1 }, duration, Phaser.Easing.Linear.None, true, delay);
               
            });
            
         });
         
         this.game.time.events.add(longestDuration+100, onComplete, this);
      }  
      
      animateScoreForChain(chain: Chain){
         var firstCookie = chain.cookies[0];
         var lastCookie = chain.cookies[chain.cookies.length - 1];
         //console.log('firstCookie.sprite.position.x: '+ firstCookie.sprite.position.x);
         //console.log('lastCookie.sprite.position.x: '+ lastCookie.sprite.position.x);
         var x = (firstCookie.sprite.position.x + lastCookie.sprite.position.x + 30)/2;
         var y = (firstCookie.sprite.position.y + lastCookie.sprite.position.y)/2 - 8;
         
         var scoreLabel = this.game.add.text(x, y, ""+chain.score, {
            font: "Gill Sans Bold",
            fill: "white",
            align: "center",
            fontSize: 30
         });
         scoreLabel.z = 300;
         
         this.game.add.tween(scoreLabel).to({ alpha: 0 }, 700, Phaser.Easing.Linear.None, true);
      }

   }
}