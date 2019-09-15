/**
 * Created by Administrator on 2019/7/12.
 */
$(function () {
    // 自定义滚动条
    $(".content_list").mCustomScrollbar();
    var $audio=$("audio");
    var player=new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    //初始化进度条
    initProgress();
    function initProgress(){
        var $progressBar=$(".music_progress_bar");
        var $progressLine=$(".music_progress_line");
        var $progressDot=$(".music_progress_dot");
        //进度条事件
         progress= Progress($progressBar,$progressLine,$progressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        var $voiceBar=$(".music_voice_bar");
        var $voiceLine=$(".music_voice_line");
        var $voiceDot=$(".music_voice_dot");
        //进度条事件
         voiceProgress= Progress($voiceBar,$voiceLine,$voiceDot);
         voiceProgress.progressClick(function (value) {
            player.musicVoiceSeekTo(value)
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoiceSeekTo(value)
        });
    }

    //加载歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:"./source/musiclist.json",
            dataType:"json",
            //加载成功的话会将数据作为参数传入
            success: function (data) {
                player.musicList=data;
                var $musicList=$(".content_list ul");
                //遍历收到的数据，初始化每一条音乐
                $.each(data, function (index, ele) {
                    var $item=crateMusicItem(index,ele);
                    $musicList.append($item);
                });
                //初始化歌曲信息
                initMusicInfo(data[0]);
                //初始化歌词信息
                initMusicLyric(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        })
    }
    //定义创建音乐的方法
    function  crateMusicItem(index,music){
      var $item = $("" +
          "<li class=\"list_music\">\n" +
          "<div class=\"list_check\"><i></i></div>\n" +
          "<div class=\"list_number\">"+(index + 1)+"</div>\n" +
          "<div class=\"list_name\">"+music.name+"" +
          "     <div class=\"list_menu\">\n" +
          "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
          "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
          "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
          "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
          "     </div>\n" +
          "</div>\n" +
          "<div class=\"list_singer\">"+music.singer+"</div>\n" +
          "<div class=\"list_time\">\n" +
          "     <span>"+music.time+"</span>\n" +
          "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
          "</div>\n" +
          "</li>");
      //给每一条音乐都绑定一个索引和数据的属性
      $item.get(0).index=index;
      $item.get(0).music=music;
      return $item;
  }
    //初始化化歌曲信息
    function   initMusicInfo(music){
        $(".song_info_name a").text(music.name);//歌曲名
        $(".song_info_singer a").text(music.singer);//歌手名
        $(".song_info_ablum a").text(music.album);//专辑名
        $(".music_progress_name").text(music.singer+"/"+music.name);//歌手/歌曲
        $(".music_progress_time").text("00:00 /"+music.time);//时间
        $(".song_info_pic img").attr("src",music.cover);//专辑图片
        $(".mask_bg").css({background:"url('"+music.cover+"')"});//高斯模糊背景图
    }
    //初始化歌词信息
    function initMusicLyric(music){
         lyric=new Lyric(music.link_lrc);
        var $lyricContainer=$(".song_lyric");//歌词ul
        //清空上一首
        $lyricContainer.html("");
        lyric.loadLyric(function () {
          //创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item=$("<li>"+ele+"</li>");
                $lyricContainer.append($item);
            })
        });
    }

    //初始化事件监听
    initEvents();
    function initEvents(){
        //歌曲移入移出事件==动态生成的元素得用事件委托监听
        $(".content_list").delegate(".list_music","mouseenter", function () {
            $(this).find(".list_menu").stop().fadeIn(100);
            //显示删除
            $(this).find(".list_time a").stop().fadeIn(100);
            //隐藏时长
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music","mouseleave", function () {
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            $(this).find(".list_time span").stop().fadeIn(100);
        });

        //复选框点击事件==事件委托
        $(".content_list").delegate(".list_check","click", function () {
            //切换事件==有则取消，无则添加
            $(this).toggleClass("list_checked")
        });
        //子菜单播放按钮切换
        $(".content_list").delegate(".list_menu_play","click", function () {
            $(this).toggleClass("list_menu_play2");
            //其他元素不变
            $(this).parents(".list_music").siblings().find(".list_menu_play").removeClass("list_menu_play2");
            if($(this).attr("class").indexOf("list_menu_play2")!=-1){
                //列表处于播放状态===让底下按钮也同步播放
                $(".music_play").addClass("music_play2");
                //播放时候让当前文字高亮
                $(this).parents(".list_music").find("div").css("color","#fff");
                //排他
                $(this).parents(".list_music").siblings().find("div").css("color","rgba(255,255,255,0.5)");
            }else{
                //列表不是播放状态
                $(".music_play").removeClass("music_play2");
                //让文字取消高亮
                $(this).parents(".list_music").find("div").css("color","rgba(255,255,255,0.5)");
            }
            //点击播放序号变成播放状态
            $(this).parents(".list_music").find(".list_number").toggleClass("list_number2");
            //排他
            $(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");

            //播放音乐
            player.playMusic( $(this).parents(".list_music").get(0).index,
                $(this).parents(".list_music").get(0).music);
            //切换歌曲信息
            initMusicInfo( $(this).parents(".list_music").get(0).music);
            //切换歌词信息
            initMusicLyric( $(this).parents(".list_music").get(0).music);
        });
        //监听左下角播放按钮
        $(".music_play").click(function () {
            if(player.currentIndex==-1){//没有播放过音乐
                //播放第一首歌
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
                //trigger可以触发对应事件，即按底下按钮触发上面菜单按钮事件
            }else{//播放过了
                //切换当前歌曲的播放与暂停
                $(".list_music").eq(player.currentIndex).find("" +
                    ".list_menu_play").trigger("click");
            }
        });
        //监听左下角上一首按钮
        $(".music_pre").click(function () {
            $(".list_music").eq(player.proIndex()).find("" +
                ".list_menu_play").trigger("click");
        });
        //监听左下角下一首按钮
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextIndex()).find("" +
                ".list_menu_play").trigger("click");
        });
        //监听删除按钮
        $(".content_list").delegate(".list_menu_del","click", function () {
            var $item=$(this).parents(".list_music");
            //删除后自动播放下一首
            if($item.get(0).index==player.currentIndex){//判断是否为当前播放音乐
                $(".music_next").trigger("click");
            }
            $item.remove();//删除当前
            player.changeMusic($item.get(0).index);//
            //删除后序号重新排序
            $(".list_music").each(function (index,ele) {
                ele.index=index;
                $(ele).find(".list_number").text(index+1);
            });
        });
        //监听播放进度
        //timeupdata实时获取当前的播放位置
        player.musicTimeDate(function (duration, currentTime, timeStr) {
            //回调函数
            $(".music_progress_time").text(timeStr);
            //同步进度条；
            //计算进度条百分比
            var value=currentTime/duration*100;
            progress.setProgress(value);
            //实现歌词同步,把当前时间传入歌词解析函数中
            var index= lyric.currentIndex(currentTime);//获得了与歌词时间匹配的当前索引值
            var $item=$(".song_lyric li").eq(index);
            $item.addClass("cur");//对应歌词高亮
            $item.siblings().removeClass("cur");//排他
            //歌词滚动
            //从第二条开始滚动
            if(index<=2)return;
            $(".song_lyric").css({
                marginTop:((-index+2)*30)
            })
        });


           //player.$audio.on("timeupdate", function () {
           //    var duration=player.getMusicDuration();//总时长
           //    var currentTime=player.getMusicCurrentTime();//当前时长
           //    //格式化时长
           //    var timeStr=formatDate(currentTime,duration);
           //    //console.log(timeStr);
           //    $(".music_progress_time").text(timeStr);
           //})
        //声音按钮的点击
        $(".music_voice_icon").click(function () {
            $(this).toggleClass("music_voice_icon2");//切换图标
            if($(this).attr("class").indexOf("music_voice_icon2")!=-1){//图标处于静音状态
                player.musicVoiceSeekTo(0)
            }else{
                player.musicVoiceSeekTo(1)
            }
        })
    }

    //function formatDate(currentTime,duration){
    //    var endMin=parseInt(duration/60);
    //    var endSec=parseInt(duration%60);
    //    if(endMin<10){
    //        endMin="0"+endMin;
    //    }
    //    if(endSec<10){
    //        endSec="0"+endSec;
    //    }
    //    var startMin=parseInt(currentTime/60);
    //    var startSec=parseInt(currentTime%60);
    //    if(startMin<10){
    //        startMin="0"+startMin;
    //    }
    //    if(startSec<10){
    //        startSec="0"+startSec;
    //    }
    //    return startMin+":"+startSec+" / "+endMin+":"+endSec;
    //}
});