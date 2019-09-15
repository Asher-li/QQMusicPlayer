/**
 * Created by Administrator on 2019/7/14.
 */
(function (window) {
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }

    Progress.prototype= {
        constructor: Progress,
        isMove:false,
        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar=$progressBar;
            this.$progressLine=$progressLine;
            this.$progressDot=$progressDot;
        },
        progressClick:function(callBack){
            var $this=this;
           this.$progressBar.click(function (event) {
               var normalLeft=$(this).offset().left;//进度条距窗口的距离
               var eventLeft=event.pageX;//点击位置距窗口的距离
               $this.$progressLine.css({width:eventLeft-normalLeft});
               $this.$progressDot.css({left:eventLeft-normalLeft});
               //计算进度条比例
               var value=(eventLeft-normalLeft)/$(this).width();
               callBack(value);
           })
        },
        progressMove: function (callBack) {
             var $this=this;
            var normalLeft=this.$progressBar.offset().left;//进度条距窗口的距离
            var eventLeft;
            var barWidth=this.$progressBar.width();
            this.$progressBar.mousedown(function () {
                this.isMove=true;
                $(document).mousemove(function (event) {
                     eventLeft=event.pageX;//点击位置距窗口的距离
                    var offset=eventLeft-normalLeft;
                    if(offset>0&&offset<barWidth){
                        $this.$progressLine.css({width:eventLeft-normalLeft});
                        $this.$progressDot.css({left:eventLeft-normalLeft});
                    }

                })
            });
            this.$progressBar.mouseup(function () {
                $(document).off("mousemove");
                $this.isMove=false;
                //计算进度条比例
                var value=(eventLeft-normalLeft)/$this.$progressBar.width();
                callBack(value);
            })
        },
        setProgress: function (value) {
            if(this.isMove)return;
            if(value<0||value>100)  return;
            this.$progressLine.css({width:value+"%"});
            this.$progressDot.css({left:value+"%"});
        }
    };
    Progress.prototype.init.prototype=Progress.prototype;
    window.Progress=Progress;
})(window);