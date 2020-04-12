var app = new Vue({
    el:'#app',
    data:{
        keyword:'',
        tableMode:true,
        csvFile1:'fish.csv',
        csvFile2:'insect.csv',
        dataArr1:[],
        dataArr2:[],
        sortArr:[],
        displayArr:[],
        label1:['No.','名前','売値','出現月','出現時間','場所,条件','魚影サイズ'],
        label2:['No.','名前','売値','出現月','出現時間','場所','条件'],
        southToggle:false,
        month:0,
        hour:0,
        realtimeCheck:true,
        csvToggle:false,
        modalNo:0,
        modalFlag:false
    },
    created:function(){
        this.getTime()
        this.setCSV()
    },
    computed:{
        label:function(){
            return (this.csvToggle) ? this.label2 : this.label1
        },
        useCSV:function(){
            return (this.csvToggle) ? this.dataArr2 : this.dataArr1
        },
        sortCSV:function(){
            var sortCSV = []
            for(var i=0;i<this.checkCSV.length;i++){
                for(var j=0;j<this.checkCSV[i].length;j++){
                    if(this.checkCSV[i][j].indexOf(this.keyword) !== -1) {
                        sortCSV.push(this.checkCSV[i]);
                        break
                    }
                }
            }
            return sortCSV
        },
        checkCSV:function(){
            //リアルタイムチェック
            var monthCheckArr = [];
            this.displayArr = [];

            if(this.realtimeCheck === true){
                var sortArr1 = [];
                var targetMonth = (this.southToggle) ? 4 : 3;
                for(var k=0;k<this.useCSV.length;k++){
                    if(this.useCSV[k][targetMonth] === 'all'){
                        monthCheckArr.push(this.useCSV[k]);
                    }else{
                        var checkArr = this.useCSV[k][targetMonth].split('.');
                        for(var l=0;l<checkArr.length;l++){
                            if(checkArr[l] == parseInt(this.month)){
                                monthCheckArr.push(this.useCSV[k]);
                            }
                        }
                    }
                }
                for(var m=0;m<monthCheckArr.length;m++){
                    if(monthCheckArr[m][5] === 'all'){
                        this.displayArr.push(monthCheckArr[m]);
                    }else{
                        var checkArr = monthCheckArr[m][5].split('.');
                        for(var n=0;n<checkArr.length;n++){
                            if(parseInt(checkArr[n]) === parseInt(this.hour)){
                                this.displayArr.push(monthCheckArr[m]);
                            }
                        }
                    }
                }
            }else{
                this.displayArr = this.useCSV
            }
            
            //1次元配列を2次元配列に変換
            var res = [];
            for(var i = 0; i < this.displayArr.length; i++){
                //空白行が出てきた時点で終了
                if(this.displayArr[i] == '') break;

                //","ごとに配列化
                res[i] = this.displayArr[i];
            }
            return res;
        },
        
    },
    methods:{
        setCSV:function(){
            var csv1 = this.csvFile1;
            var txt1 = new XMLHttpRequest();
            txt1.open('get', csv1, false);
            txt1.send();
            
            var arr1 = txt1.responseText.split('\n');
            for(var h=0;h<arr1.length;h++){
                this.dataArr1.push(arr1[h].split(','));
            }

            var csv2 = this.csvFile2;
            var txt2 = new XMLHttpRequest();
            txt2.open('get', csv2, false);
            txt2.send();
            var arr2 = txt2.responseText.split('\n');
            for(var g=0;g<arr2.length;g++){
                this.dataArr2.push(arr2[g].split(','));
            }
        },
        getTime:function(){
            var now = new Date()
            this.month = now.getMonth() + 1
            this.hour = now.getHours()
        },
        monthVal:function(value){
            if(value === 'all'){
                return '年中'
            }else{
                var arr = value.split(':')
                var monthArr = []
                for(var i=0;i<arr.length;i++){
                    monthArr.push(arr[i].split('.'))
                }
                var displayTxt = ''
                for(var j=0;j<monthArr.length;j++){
                    if(monthArr[j].length === 1){
                        displayTxt += '、' + monthArr[j][0] + '月'
                    }else{
                        displayTxt += '、' + monthArr[j][0] + '月～' + monthArr[j][monthArr[j].length-1] + '月'
                    }
                }
                displayTxt = displayTxt.slice(1)
                return displayTxt
            }
        },
        timeVal:function(value){
            if(value === 'all'){
                return '24時間'
            }else{
                var arr = value.split(':')
                var timeArr = []
                for(var i=0;i<arr.length;i++){
                    timeArr.push(arr[i].split('.'))
                }
                var displayTxt = ''
                for(var j=0;j<timeArr.length;j++){
                    if(timeArr[j].length === 1){
                        displayTxt += '、' + timeArr[j][0] + '時'
                    }else{
                        if(parseInt(timeArr[j][0]) < parseInt(timeArr[j][timeArr[j].length-1])){
                            displayTxt += '、' + timeArr[j][0] + '時～' + timeArr[j][timeArr[j].length-1] + '時'
                        }else{
                            displayTxt += '、' + timeArr[j][0] + '時～翌' + timeArr[j][timeArr[j].length-1] + '時'
                        }
                    }
                }
                displayTxt = displayTxt.slice(1)
                return displayTxt
            }
            return value
        },
        modalOpen:function(index){
            this.modalNo = parseInt(index) - 1
            this.modalFlag = true
        },
        sort:function(index){
            this.useCSV.sort(function(a,b){return(a[index] - b[index])})
        }
    }
})