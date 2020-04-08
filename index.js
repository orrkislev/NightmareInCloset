let pages, page=0, level, lang="heb"
let folder = 'a'


$.getJSON( folder + "/texts.json", function( data ) {
    pages = data.texts
    showPage(0)
  });

function showPage(pageNum){
    page = pageNum
    $("#pageImage").attr("src",folder + "/" + pages[pageNum].image);
    $("#pageImage").on('load',()=>{
        $("#slidecontainer").css('width',$("#pageImage").css('width'))
        $("#slidecontainer").css('width',$("#pageImage").css('width'))
    })

    txt = pages[pageNum].text
    txtParts = []

    if (txt!=undefined){
      if (pages[pageNum].levels == undefined){
        txtParts = [{"text":txt, "special":false}]
      } else {
        level = $("#slider").val()
        if (level==-1){
            txtParts = [{"text":txt, "special":false}]
        } else {
            level = Math.min(level,pages[pageNum].levels.length-1)
            phrases = pages[pageNum].levels[level]
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
        txtHtml += " "
    })
    $("#text").html(txtHtml)

    if (pages[pageNum].levels == undefined){
        $("#slider").hide()
    } else {
        $("#slider").show()
        $("#slider").attr('max',pages[pageNum].levels.length-1)
        if ($("#slider").val() > pages[pageNum].levels.length-1){
            $("#slider").val(pages[pageNum].levels.length-1)
        }
    }
}

updateSlider = ()=>{
    showPage(page)
}


$(document).keydown(function(e) {
    if (e.which == 37){
        page = (page+1) % pages.length
        showPage(page)
    } else if (e.which==39){
        page = (page-1+pages.length) % pages.length
        showPage(page)
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});