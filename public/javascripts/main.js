//set up filepond module
var i = 3;
$(document).ready(() => {

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode

    )
    FilePond.setOptions({
        stylePanAspecRatio: 150 / 100,
        imageResizeTargetWidth: 100,
        imageResizeTargetHeight: 100,

    })
    FilePond.parse(document.body);

    $('.comment').hide();
    load(i)
})



//

function ShowCMT() {
    $("div.comment").show();
}



function load(i) {

    $(".article").each(function () {
        if ($(this).attr("id") > i) {
            $(this).hide()
        } else {
            $(this).show()
        }
    });
}
function editArticle(id) {
    let articles = `<%- JSON.stringify(articles) %>`
    articles = JSON.parse(articles)
    articles.forEach(article => {
        if (article._id == id) {

            const content = article.content
            console.log(content)
            const imageSrc = $(`[id=${id}]`).attr("src")
            $('[name="content"]').val(content)
            $('.container.edit-article').append("<img class='edit-image'> </img>")

            $('.edit-modal').attr("action", `/articles/update/${id}` + "?_method=PUT")
            $(document).ready(e => {
                $('.edit-image').attr("src", imageSrc)
            })
        }
    })

}
$("#editArticleModal").on("hidden.bs.modal", function () {
    $('.edit-image').remove()
    $('[name="edit-content"]').val("")

});


function comment() {
    console.log("cmt")
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }

}
$(window).on("scroll", function () {
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
        sleep(400);
        load(i + 3);
    }
});
