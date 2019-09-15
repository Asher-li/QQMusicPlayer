/**
 * Created by Administrator on 2019/7/16.
 */
(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }

    Lyric.prototype= {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times:[],
        lyrics:[],
        index:-1,
        //加载歌词
        loadLyric: function (callBack) {
            var $this=this;
            $.ajax({
                url:$this.path ,
                dataType: "text",
                //加载成功的话会将数据作为参数传入
                success: function (data) {
                    //console.log(data);
                    //解析歌词
                    $this.parseLyric(data);
                    callBack();
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        //解析歌词
        parseLyric: function (data) {
            var $this=this;
            $this.times=[];
            $this.lyrics=[];//清空上一首歌曲的缓存
            var array=data.split("\n");
            //利用正则表达式提取时间
            var timeReg=/\[(\d*:\d*\.\d*)\]/;
            //遍历歌词
            $.each(array, function (index, ele) {
                //处理歌词
                var lrc=ele.split("]")[1];
                if(lrc.length==1)return true;//先排除空歌词和对应时间

                $this.lyrics.push(lrc);//获得歌词
                //处理时间
                var res=timeReg.exec(ele);//捕获
                if(res==null)return true;//相当于continue
                var timeStr=res[1];//没有[]的时间格式
                var res2=timeStr.split(":");
                var min=parseInt(res2[0])*60;
                var sec=parseFloat(res2[1]);
                var time=parseFloat(Number(min+sec).toFixed(2));//总秒数
                $this.times.push(time);//获得时间
                //var lrc=ele.split("]")[1];
                //$this.lyrics.push(lrc);//获得歌词
            });

        },
        currentIndex: function (currentTime) {
            //console.log(currentTime);
            if(currentTime>=this.times[0]){
                this.index++;
                this.times.shift();//删除数组最前面元素，把当前比较过的元素删除
                //下次比较仍然是第一个比较
            }
            return this.index;
        }
    };



    Lyric.prototype.init.prototype=Lyric.prototype;
    window.Lyric=Lyric;
})(window);