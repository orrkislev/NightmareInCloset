let pages, page=0, level, lang="heb"
let folder = 'a'

var bar = new ProgressBar.Line('#bar', {
    strokeWidth: 1,
    easing: 'easeInOut',
    duration: 800,
    color: '#FFEA82',
  });
$("#bar svg").attr("viewBox","0,0,100,3")


$.getJSON( folder + "/texts.json", function( data ) {
    pages = data.texts
    largestSumOfLevel = 0
    for (page of pages){
        if (page.levels != undefined)
            largestSumOfLevel = Math.max(largestSumOfLevel, page.levels.length)
    }
    $("#slider").attr('max',largestSumOfLevel-1)
    showTwoPage(0)
  });

function showTwoPage(pageIndex){
    page = pageIndex
    $('#sideRight').hide()
    $('#sideLeft').hide()
    if (pageIndex == pages.length){
        showPage(pageIndex,"Right")
    } else {
        showPage(pageIndex,"Right")
        showPage(pageIndex+1,"Left")
    }
    bar.animate((pageIndex/2) / (Math.floor((pages.length-1)/2)))
}

function showPage(pageNum, side){
    if (pages[pageNum].image != undefined){
        $('#side'+side).show()
        $("#pageImage"+side).attr("src",folder + "/" + pages[pageNum].image);
    }


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
    $("#text"+side).html(txtHtml)
}

updateSlider = ()=>{
    showTwoPage(page)
}


$(document).keydown(function(e) {
    if (e.which == 37){
        page = (page+2) % pages.length
        showTwoPage(page)
    } else if (e.which==39){
        page = (page-2+pages.length) % pages.length
        showTwoPage(page)
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});