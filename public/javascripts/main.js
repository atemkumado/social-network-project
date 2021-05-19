//set up filepond module
var i = 10;
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
    $('.storage_comment').hide();
    $('.comment').hide();
    load(i)
})

function getFacultyOption() {

    if ($('#faculty-select').val() == 0) {
        data = "Phòng Công tác học sinh sinh viên (CTHSSV), Phòng Đại học, Phòng Sau đại học, Phòng điện toán và máy tính, Phòng khảo thí và kiểm định chất lượng, Phòng tài chính, TDT Creative Language Center, Trung tâm tin học, Trung tâm đào tạo phát triển xã hội (SDTC), Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM), Trung tâm hợp tác doanh nghiệp và cựu sinh viên, Khoa Luật, Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa, Viện chính sách kinh tế và kinh doanh, Khoa Mỹ thuật công nghiệp, Khoa Điện – Điện tử, Khoa Công nghệ thông tin, Khoa Quản trị kinh doanh, Khoa Môi trường và bảo hộ lao động, Khoa Lao động công đoàn, Khoa Tài chính ngân hàng, Khoa giáo dục quốc tế"
        data = data.split(',');
        var list = [];
        data = Array.from(data)

        data.forEach((faculty, index) => {
            var opt = document.createElement('option');
            opt.value = index + 1;
            opt.innerHTML = faculty;
            document.getElementById('faculty-select').appendChild(opt)

        })
    }




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


function loadComment(id) {
    let check = $('#cmt_' + id).data("check")
    if (!check) {
        $('#cmt_' + id).show();
        $('#cmt_' + id).data("check", true);
    } else {
        $('#cmt_' + id).hide();
        $('#cmt_' + id).data("check", false);
    }


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




