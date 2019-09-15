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
        //���ظ��
        loadLyric: function (callBack) {
            var $this=this;
            $.ajax({
                url:$this.path ,
                dataType: "text",
                //���سɹ��Ļ��Ὣ������Ϊ��������
                success: function (data) {
                    //console.log(data);
                    //�������
                    $this.parseLyric(data);
                    callBack();
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        //�������
        parseLyric: function (data) {
            var $this=this;
            $this.times=[];
            $this.lyrics=[];//�����һ�׸����Ļ���
            var array=data.split("\n");
            //����������ʽ��ȡʱ��
            var timeReg=/\[(\d*:\d*\.\d*)\]/;
            //�������
            $.each(array, function (index, ele) {
                //������
                var lrc=ele.split("]")[1];
                if(lrc.length==1)return true;//���ų��ո�ʺͶ�Ӧʱ��

                $this.lyrics.push(lrc);//��ø��
                //����ʱ��
                var res=timeReg.exec(ele);//����
                if(res==null)return true;//�൱��continue
                var timeStr=res[1];//û��[]��ʱ���ʽ
                var res2=timeStr.split(":");
                var min=parseInt(res2[0])*60;
                var sec=parseFloat(res2[1]);
                var time=parseFloat(Number(min+sec).toFixed(2));//������
                $this.times.push(time);//���ʱ��
                //var lrc=ele.split("]")[1];
                //$this.lyrics.push(lrc);//��ø��
            });

        },
        currentIndex: function (currentTime) {
            //console.log(currentTime);
            if(currentTime>=this.times[0]){
                this.index++;
                this.times.shift();//ɾ��������ǰ��Ԫ�أ��ѵ�ǰ�ȽϹ���Ԫ��ɾ��
                //�´αȽ���Ȼ�ǵ�һ���Ƚ�
            }
            return this.index;
        }
    };



    Lyric.prototype.init.prototype=Lyric.prototype;
    window.Lyric=Lyric;
})(window);