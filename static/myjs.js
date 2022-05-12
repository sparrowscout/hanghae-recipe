$(document).ready(function () {
    // 파일업로드 코드 (부트스트랩)
    // bsCustomFileInput.init()
    listing_recipe()
})

// 레시피 posting 함수#}
function posting_recipe() {
    let title = $("#title").val()
    let content = $("#content").val()
    let ingred = $("#ingred").val()
    let file = $('#file')[0].files[0]
    let form_data = new FormData()

    form_data.append("file_give", file)
    form_data.append("title_give", title)
    form_data.append("content_give", content)
    form_data.append("ingred_give", ingred)

    $.ajax({
        type: "POST",
        url: "/posting_recipe",
        data: form_data,
        cache: true,
        contentType: false,
        processData: false,
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}

// 레시피 listing 함수#}
function listing_recipe() {
    $('#recipe-cards').empty()
    $.ajax({
        type: "GET",
        url: "/listing_recipe?sample_give=샘플데이터",
        data: {},
        success: function (response) {
            let recipes = response['all_recipes']
            for (let i = 0; i < recipes.length; i++) {
                let title = recipes[i]['title']
                let content = recipes[i]['content']
                let ingred = recipes[i]['ingred']
                let file = recipes[i]['file']

                let temp_html = `<div class="col" id="${recipes["_id"]}">
                                    <a onclick='$("#modal-post").addClass("is-active")'>
                                    <div class="card h-100">
                                        <img src="${file}" class="card-img-top card-img">
                                        <div class="card-body">
                                            <h5 class="card-title">${title}</h5>
                                    <p class="card-text" style="color:gray;">${ingred}</p>
                                            <p class="card-text">${content}</p>
                                        </div>
                                    </div>
                                    </a>
                                </div>`
                $('#recipe-cards').append(temp_html)

            }
        }
    })
}

// 좋아요 업데이트 함수 (클라이언트)
function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "unlike"
            },
            success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/update_like",
            data: {
                post_id_give: post_id,
                type_give: type,
                action_give: "like"
            },
            success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

// 로그아웃은 내가 가지고 있는 토큰만 쿠키에서 없애면 됩니다.
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃!')
    window.location.href = '/login'
}

function post() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST",
        url: "/posting",
        data: {
            comment_give: comment,
            date_give: today
        },
        success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

// 7일 이상일 때에는 날짜로 보여주는 코드
function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

// 좋아요 숫자 500개 넘으면 0.5k, 1,000개가 넘으면 1k(정수)로 표시
function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}



function get_posts(id) {
    if (id == undefined) {
        id = ""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET",
        url: `/get_posts?id_give=${id}`,
        data: {},
        success: function (response) {
            if (response["result"] === "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)
                    // 서버에서 좋아요 카운트 후 클라이언트에서 빈하트/풀하트 여부 결정
                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let count_heart = post['count_heart']

                    let html_temp = `<div id="${post["_id"]}" style="margin-bottom: 20px">
                                                    <article class="media">
                                                        <figure class="media-left">
                                                            <a class="image is-64x64" href="/mypage/${post['id']}">
                                                                <img class="is-rounded" src="/static/${post['profile_pic_real']}">
                                                            </a>
                                                        </figure>
                                                        <div class="media-content">
                                                            <div class="content">
                                                                <p>
                                                                    <strong>${post['profile_name']}</strong> <small>@${post['id']}</small> <small>${time_before}</small>
                                                                    <br>
                                                                    ${post['comment']}
                                                                </p>
                                                            </div>
                                                            <nav class="level is-mobile">
                                                                <div class="level-left">
                                                                    <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                                        <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                                       aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
                                                                    </a>
                                                                </div>

                                                            </nav>
                                                        </div>
                                                    </article>
                                                </div>`

                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}