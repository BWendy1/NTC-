let dataInfo = {
    id: null,
    rearContact: null,
    sharePoint: null,
    len: null
};
let datas = [];
let popDatas = [];
let trs = [];
let idKey = 0;
let gData = '';
let id;
let userId;
$(function () {
    id = getUrlParam("id");
    userId = getUrlParam('userId'); 
    change = getUrlParam('change'); 
    if (!userId) { // 无userId大概率为用户直接输入网址进入标注页
        alert('请登陆')
        window.location.href = '/dist'
        return
    }
    if (change) { // 修改的时候请求保存的数据
        debugger
        $.post("/cgi-bin/getFinishData.py", {
            originId: id,
            userId: userId
        }, function (res) {
            debugger;
            const data = JSON.parse(res).data;
            if (data) {
                $('#changePreview').show()
                $('#changePreviewDiv').html(data.is.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
            } else {
                alert(JSON.parse(res).message);
                window.history.go(-1);
            }
            
        });
        // 发送请求获取完成表里的预览数据
    }
    $.post("/cgi-bin/getSentenceById.py", {
        id: id,
        userId: userId
    }, function (res) {
        debugger;
        const data = JSON.parse(res).data;
        if (data) {
            gData = data.g;
            datas.push(data);
            $("#toLabel p ").text(data.text);
            $("#preview1").text(data.text);
            $("#preview2").text(data.text);
        } else {
            alert(JSON.parse(res).message);
            window.history.go(-1);
        }
        
    });
    let end, start, chosenText;
    let $contextMenu = $("#contextMenu");
    let  selection = window.getSelection();
    changeBtnStatus('#shareBtn', true);

    let menu = [{
        name: '设置为共享头',
        title: 'create button',
        fun: function () {
            alert('i am add button')
        }
    }, {
        name: '设置为后置句',
        title: 'update button',
        fun: function () {
            alert('i am update button')
        }
    }]
    //hide菜单项
    $(document).click(function () {
        $contextMenu.hide();
    });
    //工作区绑定菜单事件
    $("#toLabel").on("click", function (e) {
        setTimeout(function () {
            if(selection.toString() !== "" && selection.anchorNode === selection.focusNode){
                end = selection.focusOffset;
                start = selection.anchorOffset;
                if(end < start){
                    let temp = end;
                    end = start;
                    start = temp;
                }
                chosenText = selection.toString();
                contextMenu($contextMenu, e);
            }else{
                $contextMenu.hide();
            }
            e.stopPropagation();
        }, 100);
    });
    //菜单按钮响应事件
    $("#contextMenu").on("click", "input", function(e){
        debugger
        switch ($(e.target).attr('key')){
            case 'direct0':
                if(end){
                    dataInfo.sharePoint = end-1;
                    dataInfo.len = end - start;
                    $("#dataGroups tr:last-child td")[1].innerText = chosenText;
                    if(testChild(dataInfo)){
                        let a = {};
                        a.name = "setRelation";
                        a.start = dataInfo.rearContact;
                        a.end = dataInfo.sharePoint;
                        a.length = 0;
                        a.direction = 0;
                        debugger
                        console.log(a);
                        const params = {
                          g: gData,
                          a: JSON.stringify(a)
                        }
                        ajax(params);
                    }else{
                        alert("数据错误，请重试!");
                        break;
                    }
                    changeBtnStatus('#rearBtn', false);
                    changeBtnStatus('#shareBtn', true);
                  changeBtnStatus('#splitline', false);
                  changeBtnStatus('#addSubgraph', false);
                  clearDataInfo();
                }
                break;
            case 'direct2':
                if(end) {
                    dataInfo.sharePoint = end - 1;
                    dataInfo.len = end - start;
                    $("#dataGroups tr:last-child td")[1].innerText = chosenText;
                    if (testChild(dataInfo)) {
                        let a = {};
                        a.name = "setRelation";
                        a.start = dataInfo.rearContact;
                        a.end = dataInfo.sharePoint;
                        a.length = 0;
                        a.direction = 2;
                        console.log(a);
                        debugger
                        const params = {
                            g: gData,
                            a: JSON.stringify(a)
                        }
                        ajax(params);
                    } else {
                        alert("数据错误，请重试!");
                        break;
                    }
                    changeBtnStatus('#rearBtn', false);
                    changeBtnStatus('#shareBtn', true);
                  changeBtnStatus('#splitline', false);
                  changeBtnStatus('#addSubgraph', false);
                  clearDataInfo();
                }
                break;
            case 'addSubgraph':
                if(end){
                    let a = {};
                    a.name = "addSubgraph";
                    a.start = start;
                    a.end = end;
                    debugger
                    $.ajax(
                      {
                      url: '/cgi-bin/tag.py',
                      type: 'POST',
                      data: {
                        g: gData,
                        a: JSON.stringify(a)
                      }
                    })
                      .done(res => {
                        console.log(res);
                        if (res.indexOf('Traceback') >= 0) {
                          alert('数据错误，请重新标注！');
                          return;
                        }
                        const data = JSON.parse(res);
                        if (data) {
                          if (popDatas.length) {
                            popDatas = [];
                          }
                          datas.push(data)
                          gData = data.g;
                          let id = idKey++ + "";
                          let tr = `<tr id=${id}>
                                      <td>ADDSUBGRAPH</td>
                                      <td>${chosenText}</td>
                                   </tr>`;
                          $("#dataGroups").append(tr);
                          $("#toLabel p").text(data.text);
                          $("#preview1").html(data.is.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
                          $("#preview2").html(data.cs.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
                        } else {
                          alert("数据错误，请重新标注！");
                        }
                    })
                      .fail(err => {
                        alert("数据错误，请重新标注！");
                      })
                    changeBtnStatus('#rearBtn', false);
                    changeBtnStatus('#shareBtn', true);
                  changeBtnStatus('#splitline', false);
                  changeBtnStatus('#addSubgraph', false);
                  clearDataInfo();
                }
                break;
            case 'len0':
                if(end){
                    dataInfo.sharePoint = end-1;
                    dataInfo.len = 0;
                    $("#dataGroups tr:last-child td")[1].innerText = chosenText;
                    if(testChild(dataInfo)){
                        let a = {};
                        a.name = "setRelation";
                        a.start = dataInfo.rearContact;
                        a.end = dataInfo.sharePoint;
                        a.length = dataInfo.len;
                        a.direction = 1;
                        debugger
                        const params = {
                            g: gData,
                            a: JSON.stringify(a)
                        }
                        ajax(params);
                    }else{
                        alert("数据错误，请重试!");
                        break;
                    }
                    changeBtnStatus('#rearBtn', false);
                    changeBtnStatus('#shareBtn', true);
                  changeBtnStatus('#splitline', false);
                  changeBtnStatus('#addSubgraph', false);
                  clearDataInfo();
                }
                break;
            case 'lenD':
                if(end){
                    dataInfo.sharePoint = end-1;
                    dataInfo.len = end - start;
                    $("#dataGroups tr:last-child td")[1].innerText = chosenText;
                    if(testChild(dataInfo)){
                        let a = {};
                        a.name = "setRelation";
                        a.start = dataInfo.rearContact;
                        a.end = dataInfo.sharePoint;
                        a.length = dataInfo.len;
                        a.direction = 1;
                        debugger
                        const params = {
                            g: gData,
                            a: JSON.stringify(a)
                        }
                        ajax(params);
                    }else{
                        alert("数据错误，请重试!");
                        break;
                    }
                    changeBtnStatus('#rearBtn', false);
                    changeBtnStatus('#shareBtn', true);
                    changeBtnStatus('#splitline', false);
                    changeBtnStatus('#addSubgraph', false);
                    clearDataInfo();
                }
                break;
            case 'rearBtn':
                if(end){
                    dataInfo.rearContact = start;
                    let id = idKey++ + "";
                    dataInfo.id = id;
                    let tr = `<tr id=${id}>
                                <td>SETRELATION</td>
                                <td></td>
                                <td>${chosenText}</td>
                             </tr>`;
                    $("#dataGroups").append(tr);
                    changeBtnStatus('#rearBtn', true);
                    changeBtnStatus('#splitline', true);
                    changeBtnStatus('#addSubgraph', true);
                    changeBtnStatus('#shareBtn', false);
                }
                break;
            case 'split':
                if(end){
                    let a = {};
                    a.name = "split";
                    a.pos = start;
                    if ($(e.target).direction) {
                        a.direction = parseInt($(e.target).direction);
                    }
                    debugger
                    $.ajax({
                      url: '/cgi-bin/tag.py',
                      type: 'POST',
                      data: {
                        g: gData,
                        a: JSON.stringify(a)
                      }
                    }).done(res => {
                        console.log(res)
                        if (res.indexOf('Traceback') >= 0) {
                            alert('数据错误，请重新标注！');
                            return;
                        }
                        const data = JSON.parse(res);
                        if (data) {
                          if (popDatas.length) {
                            popDatas = [];
                          }
                          datas.push(data)
                          gData = data.g;
                          let id = idKey++ + "";
                          let tr = `<tr id=${id}>
                                    <td>SPLIT</td>
                                    <td>split位置${a.pos}</td>
                                 </tr>`;
                          $("#dataGroups").append(tr);
                          $("#toLabel p").text(data.text);
                          $("#preview1").html(data.is.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
                          $("#preview2").html(data.cs.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
                        } else {
                          alert("数据错误，请重新标注！");
                        }
                    })
                      .fail(err => {
                        alert("数据错误，请重新标注！");
                      })
                    changeBtnStatus('#rearBtn', false);
                    changeBtnStatus('#shareBtn', true);
                    changeBtnStatus('#splitline', false);
                    changeBtnStatus('#addSubgraph', false);
                    clearDataInfo();
                }
                break;
            default:
                break;
        }
        $contextMenu.hide();
        selection.removeAllRanges();
        e.stopPropagation();
    });
    /*//删除单条标注
    $("#dataGroups").on("click", "a", function (e) {
        var $tr = $(e.target).parent().parent();
        deleteOneById($tr[0].id, datas);
        $tr[0].remove();
        changeBtnStatus('#rearBtn', false);
        changeBtnStatus('#shareBtn', true);
    });*/
    // 保存
    $("#save").on("click", function (){
        parentId = getUrlParam("parentId");
        debugger;
        if (datas.length <= 1) {
            alert('您好，请标注后再保存');
            return;
        }
        $.post("/cgi-bin/save.py", {
            originId: id,
            lastUserId: userId,
            parentId: parentId,
            data: gData,
        }, function (resp) {
            const res = JSON.parse(resp);
            if (res && res.success) {
                alert('保存成功');
                window.history.go(-1);
            } else {
                alert(res.message);
            }
            
        })
    });

    // 撤销
    $("#repeal").on("click", function (e) {
        if (dataInfo.rearContact && !dataInfo.sharePoint) {
            clearDataInfo();
            $("#dataGroups tr:last-child")[0].remove();
            changeBtnStatus('#rearBtn', false);
            changeBtnStatus('#shareBtn', true);
            changeBtnStatus('#splitline', false);
            changeBtnStatus('#addSubgraph', false);
            return;
        }
        if(datas.length <= 1) {
            return;
        }
        popDatas.push(datas.pop());
        let lastData = datas[datas.length - 1];
        $("#preview1").html(lastData.is.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
        $("#preview2").html(lastData.cs.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
        gData = lastData.g;
        let $tr = $("#dataGroups tr:last-child")[0];
        trs.push($tr.outerHTML);
        $tr.remove();
        changeBtnStatus('#rearBtn', false);
        changeBtnStatus('#shareBtn', true);
        changeBtnStatus('#splitline', false);
        changeBtnStatus('#addSubgraph', false);
    });
    // 还原
    $("#revert").on("click", function () {
       if (!popDatas.length) {
           alert("已经是最新记录");
           return;
       }
       let revertData = popDatas.pop();
       datas.push(revertData);
       $("#dataGroups").append(trs.pop());
       $("#toLabel p").text(revertData.text);
       $("#preview1").html(revertData.is.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
       $("#preview2").html(revertData.cs.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
       gData = revertData.g;
    });
    $("#endContext").mouseover(function(e) {
        $("#endContext>ul").css("visibility", "visible")
    });
    $("#endContext").mouseout(function(e) {
        $("#endContext>ul").css("visibility", "hidden")
    });
    $("#direct1Context").mouseover(function(e) {
        $("#direct1Context>ul").css("visibility", "visible")
    });
    $("#direct1Context").mouseout(function(e) {
        $("#direct1Context>ul").css("visibility", "hidden")
    });
    $("#split").mouseover(function(e) {
        $("#split>ul").css("visibility", "visible")
    });
    $("#split").mouseout(function(e) {
        $("#split>ul").css("visibility", "hidden")
    });
});

/**
 * 判断第一层子元素是否全不为null
 * @param obj
 * @returns {boolean}
 */
function testChild(obj) {
    if(obj){
        for(let key in obj){
            if(obj[key] === null){
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * 浅拷贝
 * @param obj
 * @returns {{}}
 */
function notDeepCopy(obj) {
    let c = {};
    if(obj){
        for(let key in obj){
            c[key] = obj[key];
        }
    }
    return c;
}
function deleteOneById(id, arr) {
    for(let i=0;i<arr.length;i++){
        if(arr[i].id === id){
            return arr.splice(i,1);
        }
    }
}

function getUrlParam(paraName) {
　　　　var url = document.location.toString();
　　　　var arrObj = url.split("?");

　　　　if (arrObj.length > 1) {
　　　　　　var arrPara = arrObj[1].split("&");
　　　　　　var arr;

　　　　　　for (var i = 0; i < arrPara.length; i++) {
　　　　　　　　arr = arrPara[i].split("=");

　　　　　　　　if (arr != null && arr[0] == paraName) {
　　　　　　　　　　return arr[1];
　　　　　　　　}
　　　　　　}
　　　　　　return "";
　　　　}
　　　　else {
　　　　　　return "";
　　　　}
　　}

/**
 * 置空dataInfo
 */
function clearDataInfo () {
  dataInfo.rearContact = null;
  dataInfo.id = null;
  dataInfo.sharePoint = null;
  dataInfo.len = null;
}

/**
 * 菜单项
 * @param e
 */
function contextMenu($contextMenu, e){
    if($contextMenu.is(":hidden")) {
        $contextMenu.show();
    }
    $contextMenu.css("left", e.clientX + 5);
    $contextMenu.css("top", e.clientY + 5);
}

/**
 *  改变按钮状态
 * @param id
 * @param isDisabled
 */
function changeBtnStatus(id,isDisabled){
    if(isDisabled){
        $(id).attr("disabled",true);
        $(id).removeClass("context-btn");
        $(id).addClass("disabled");
    }else{
        $(id).attr("disabled",false);
        $(id).removeClass("disabled");
        $(id).addClass("context-btn");
    }

}

function ajax (data) {
  $.ajax({
    url: '/cgi-bin/tag.py',
    type: 'POST',
    data: data
  }).done(res =>{
    console.log(res)
    if (res.indexOf('Traceback') >= 0) {
        alert('数据错误，请重新标注！');
        $("#dataGroups tr:last-child")[0].remove();
        return;
    }
    const data = JSON.parse(res);
    if (data) {
      if (popDatas.length) {
          popDatas = [];
      }
      datas.push(data)
      gData = data.g;
      $("#toLabel p").text(data.text);
      $("#preview1").html(data.is.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
      $("#preview2").html(data.cs.replace(/\r/g,"&nbsp;").replace(/\n/g,"<br />"));
    } else {
      $("#dataGroups tr:last-child")[0].remove();
      alert("数据错误，请重新标注！");
    }
  })
    .fail(err => {
      $("#dataGroups tr:last-child")[0].remove();
      alert("数据错误，请重新标注！");
    })
}
// 获取cookie
function getCookie (cname) {
    let name = cname + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        var c = ca[i].trim()
        if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
        }
    }
    return ''
}