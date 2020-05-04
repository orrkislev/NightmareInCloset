let pages, pageNum=0, level, lang="heb"
let folder = 'giant'

var bar = new ProgressBar.Line('#bar', {
    strokeWidth: 1,
    easing: 'easeInOut',
    duration: 800,
    color: '#FFEA82',
  });
$("#bar svg").attr("viewBox","0,0,100,3")
$("#slidecontainer").hide()


$.getJSON( folder + "/texts.json", function( data ) {
    pages = data.texts
    showPage(pageNum)
  });

function showPage(pageNum){
    bar.animate(pageNum/pages.length);
    if (pages[pageNum].image != undefined){
        $("#pageImage").attr("src",folder + "/" + pages[pageNum].image);
    }


    txt = pages[pageNum].text
    txtParts = []

    if (txt!=undefined){
      if (pages[pageNum].levels == undefined){
        txtParts = [{"text":txt, "special":false}]
        $("#slider").attr('max',0)
      } else {
        level = $("#slider").val()
        if (level==-1){
            txtParts = [{"text":txt, "special":false}]
        } else {
            level = Math.min(level,pages[pageNum].levels.length-1)
            levelRelative = $("#slider").val() /  $("#slider").attr('max')
            console.log(levelRelative)
            levelRelative = Math.round(levelRelative * (pages[pageNum].levels.length-1))
            $("#slider").attr('max',pages[pageNum].levels.length-1)
            $("#slider").val(levelRelative)
            level = levelRelative

            phrases = []
            for (let i=level;i>=0;i--){
                phrases.push(pages[pageNum].levels[i][0])
            }
            rgx = ''
            phrases.forEach(phrase => {
                rgx = rgx + "|" + phrase.phrase
            });
            rgx = rgx.substr(1)
            rgx = "("+rgx+")"
            rgx = new RegExp(rgx,'g');
            txt = pages[pageNum].text.split(rgx)

            txt.forEach((part)=>{
                txtParts.push({"text":part,"special":false})
            })

            phrases.forEach(phrase => {
                txtParts.forEach((part)=>{
                    if (part.text==phrase.phrase){
                        part.text = phrase[lang]
                        part.special = true
                    }
                })
            });
        }
      }
    }

    txtHtml = ""
    txtParts.forEach((part)=>{
        if (part.special){
            txtHtml += "<span class=special>" + part.text + "</span>"
        } else {
            txtHtml += part.text
        }
        // txtHtml += " "
    })
    $("#text").html(txtHtml)
}

updateSlider = ()=>{
    showPage(pageNum)
}

nextPage = ()=>{
    pageNum = (pageNum+1)%pages.length
    $('#slidecontainer').hide()
    showPage(pageNum)
}

lastPage = ()=>{
    pageNum = (pageNum-1+pages.length) % pages.length
    $('#slidecontainer').hide()
    showPage(pageNum)
}


$(document).keydown(function(e) {
    if (e.which == 37){
        nextPage()
    } else if (e.which==39){
        lastPage()
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

$('#overlay').click(function(e) {
    if ($('#slidecontainer').is(":hidden")) {
        $('#slidecontainer').show()
        $('#slidecontainer').css("right",$(window).width()- e.pageX)
        $('#slidecontainer').css("top",e.pageY)
    } else {
        $('#slidecontainer').hide()
    }
});