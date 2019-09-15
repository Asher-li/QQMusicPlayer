/**
 * Created by Administrator on 2019/7/13.
 */
(function (window) {
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    Player.prototype={
        constructor:Player,
        musicList:[],
        init: function ($audio) {
             this.$audio=$audio;
            this.audio=$audio.get(0);
        },
        currentIndex:-1,
        playMusic:function (index,music){
          if(this.currentIndex==index){//判断是否为同一首歌
              if(this.audio.paused){//是同一首就在播放暂停切换
                   this.audio.play();
              }else{
                  this.audio.pause();
              }
          }else{//不是同一首就切歌
              //首次点击肯定不可能是-1，所以先会执行一次else来获取播放src
              this.$audio.attr("src",music.link_url);
              this.audio.play();
              this.currentIndex=index;
          }
        },
        //处理上一首下一首索引问题
        proIndex: function () {
            var index=this.currentIndex-1;
            if(index<0){
                index=this.musicList.length-1
            }
            return index;
        },
        nextIndex: function () {
            var index=this.currentIndex+1;
            if(index>this.musicList.length-1){
                index=0;
            }
            return index;
        },
        changeMusic: function (index) {
            //删除对应索引的那条音乐
            this.musicList.splice(index,1);
            //如果删除正播放音乐前一条
            if(index<this.currentIndex){
                this.currentIndex=this.currentIndex-1;
                //current Index的值是和json数组的索引相关的，
                // 删除一项音乐后，json数据库没有变，current Index的值也就没有变，
                // 当点击删除，自动触发下一首按钮时，current Index的值加一，
                // 而当删除正播放的前面的歌曲时，current Index值和index值并不一致，
                // 所以把current Index的值减一就相当于把数据库里的音乐删除了
            }
        },
        //获取总时长
        //getMusicDuration: function () {
        //    return this.audio.duration;
        //},
       //获取播放时长
       // getMusicCurrentTime: function () {
       //     return this.audio.currentTime;
       // },
        musicTimeDate: function (callBack) {
            $this=this;
            this.$audio.on("timeupdate", function () {
                var duration=$this.audio.duration;//总时长
                var currentTime=$this.audio.currentTime;//当前时长
                //格式化时长
                var timeStr=$this.formatDate(currentTime,duration);
                //console.log(timeStr);
              //  return这里不能用return来返回，因为return就近原则会返回audio
                //而不是musicDate，用一个回调函数cllback
                //只要调用该方法时传入一个函数，就可以将三个参数传给这个函数
                callBack(duration,currentTime,timeStr);
            })
        },

        //格式化时间的方法
        formatDate: function (currentTime,duration){
        var endMin=parseInt(duration/60);
        var endSec=parseInt(duration%60);
        if(endMin<10){
            endMin="0"+endMin;
        }
        if(endSec<10){
            endSec="0"+endSec;
        }
        var startMin=parseInt(currentTime/60);
        var startSec=parseInt(currentTime%60);
        if(startMin<10){
            startMin="0"+startMin;
        }
        if(startSec<10){
            startSec="0"+startSec;
        }
        return startMin+":"+startSec+" / "+endMin+":"+endSec;
        },
        musicSeekTo: function (value) {
            if(isNaN(value)) return;
            this.audio.currentTime=this.audio.duration*value;
        },
        musicVoiceSeekTo: function (value) {//volume用来监听音量
            if(isNaN(value)) return;
            if(value<0||value>1) return;
            this.audio.volume=value;
        }
    };
    Player.prototype.init.prototype=Player.prototype;
    window.Player=Player;
})(window);