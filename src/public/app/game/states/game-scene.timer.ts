module GameApp.States{
	'use strict';
	
	export class GameTimer{
		
	  game: Phaser.Game;
      
      timer: Phaser.Timer;
      timerEvent: Phaser.TimerEvent;
      timerText: Phaser.Text;

      GameScene: GameScene;
		
		constructor(game: Phaser.Game) {
			this.game = game;
		}
		
		renderTimer() {
         if(this.timer.running){
            this.timerText.text = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
         }
         else{
             if(this.timerText.text != "Game over"){ //sterben
                  this.timerText.text = "Hecho";
             }
               
         }
      }
      
      createTimer() {
         
         //var timerlabel = this.game.add.text(32, 20, "time:", { //sterben
        //  var timerlabel = this.game.add.text(32, 20, "Tiempo:", {
        //     font: "Sans Serif",
        //     fill: "white",
        //     align: "center",
        //     fontSize: 20
        //  });
        //  timerlabel.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);

         //this.timerText = this.game.add.text(32, 40, "0", {
           this.timerText = this.game.add.text(this.game.world.centerX+170, 680, "0", {
             font: "Gill Sans Bold",
             fill: "white",
             align: "center",
             fontSize: 50
         });
         this.timerText.setShadow(-1, 1, 'rgba(0,0,0,0.5)', 0);
         
         this.timer = this.game.time.create();
         this.timerEvent = this.timer.add(Phaser.Timer.MINUTE*0 + Phaser.Timer.SECOND*40,  this.endTimer, this);
         this.timer.start();
      }

      updateTimer(){
         var realTime = Math.round((this.timerEvent.delay - this.timer.ms) / 1000)*1000;
         var extraTime = 20000;
         //Elimino el tiempo base
         this.game.time.events.remove(this.timerEvent);

         //se crea nuevo temporizador con tiempo adicional
         this.timer = this.game.time.create();
         console.log('actualiza tiempo: '+(realTime+extraTime));
         this.timerEvent = this.timer.add(realTime+extraTime,  this.endTimer, this);
         this.timer.start();
      }
      
      endTimer(){
         var realTime2 = Math.round((this.timerEvent.delay - this.timer.ms) / 1000);
         console.log('realTime2_: '+realTime2);
         if(realTime2 <= 0){
            this.timer.stop();
            this.timerText.text = "Game over";
                var bg = this.game.add.sprite(this.game.world.centerX, -550, 'levelComplete');
                bg.anchor.setTo(0.5, 0.5);
                var tween = this.game.add.tween(bg).to({ x: this.game.world.centerX, y: this.game.world.centerY }, 3000, Phaser.Easing.Bounce.Out, true);
         
            // var levelNumber = parseInt(this.game.state.states['GameScene'].levelNumber);
            // if(levelNumber <= 4){
            //     levelNumber = levelNumber+1;
            //     var bg = this.game.add.sprite(this.game.world.centerX, -200, 'levelComplete');
            //     bg.anchor.setTo(0.5, 0.5);
            //     var tween = this.game.add.tween(bg).to({ x: this.game.world.centerX, y: this.game.world.centerY }, 3000, Phaser.Easing.Bounce.Out, true);
            //     tween.onComplete.add(() => {
            //         this.changeLevel(levelNumber);
            //     }, this)
            // }
            // else{
            //     this.timerText.text = "Game over";
            // }
         }
         
        
      }
      
      changeLevel(levelNumber: number){
         this.game.state.states['GameScene'].levelNumber = levelNumber;
         this.game.state.states['GameScene'].score = this.game.state.states['GameScene'].score;
         this.game.state.start('GameScene', true, false);
      }
      
      formatTime(s: number){
         var minutes: any = "0" + Math.floor(s / 60);
         var seconds = "0" + (s - minutes * 60);
         return minutes.substr(-2) + ":" + seconds.substr(-2); 
      }
		
	}
	
}