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
          if(this.currentIndex==index){//�ж��Ƿ�Ϊͬһ�׸�
              if(this.audio.paused){//��ͬһ�׾��ڲ�����ͣ�л�
                   this.audio.play();
              }else{
                  this.audio.pause();
              }
          }else{//����ͬһ�׾��и�
              //�״ε���϶���������-1�������Ȼ�ִ��һ��else����ȡ����src
              this.$audio.attr("src",music.link_url);
              this.audio.play();
              this.currentIndex=index;
          }
        },
        //������һ����һ����������
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
            //ɾ����Ӧ��������������
            this.musicList.splice(index,1);
            //���ɾ������������ǰһ��
            if(index<this.currentIndex){
                this.currentIndex=this.currentIndex-1;
                //current Index��ֵ�Ǻ�json�����������صģ�
                // ɾ��һ�����ֺ�json���ݿ�û�б䣬current Index��ֵҲ��û�б䣬
                // �����ɾ�����Զ�������һ�װ�ťʱ��current Index��ֵ��һ��
                // ����ɾ�������ŵ�ǰ��ĸ���ʱ��current Indexֵ��indexֵ����һ�£�
                // ���԰�current Index��ֵ��һ���൱�ڰ����ݿ��������ɾ����
            }
        },
        //��ȡ��ʱ��
        //getMusicDuration: function () {
        //    return this.audio.duration;
        //},
       //��ȡ����ʱ��
       // getMusicCurrentTime: function () {
       //     return this.audio.currentTime;
       // },
        musicTimeDate: function (callBack) {
            $this=this;
            this.$audio.on("timeupdate", function () {
                var duration=$this.audio.duration;//��ʱ��
                var currentTime=$this.audio.currentTime;//��ǰʱ��
                //��ʽ��ʱ��
                var timeStr=$this.formatDate(currentTime,duration);
                //console.log(timeStr);
              //  return���ﲻ����return�����أ���Ϊreturn�ͽ�ԭ��᷵��audio
                //������musicDate����һ���ص�����cllback
                //ֻҪ���ø÷���ʱ����һ���������Ϳ��Խ��������������������
                callBack(duration,currentTime,timeStr);
            })
        },

        //��ʽ��ʱ��ķ���
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
        musicVoiceSeekTo: function (value) {//volume������������
            if(isNaN(value)) return;
            if(value<0||value>1) return;
            this.audio.volume=value;
        }
    };
    Player.prototype.init.prototype=Player.prototype;
    window.Player=Player;
})(window);