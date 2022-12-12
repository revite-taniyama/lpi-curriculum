const csrfToken = document.getElementsByName('csrf-token')[0].content;

const elements = document.getElementsByClassName("history-delete");
for (let elem of elements) {
    elem.addEventListener("click", function () {
        if (confirm('購入履歴を削除しますか？')) {
            deleteHistory(this);
        }
    })
}
/**
 * @param {Element} elem
 */
async function deleteHistory(elem) {
    const form = new FormData();
    form.append("id", elem.dataset.id);
    form.append("_token", csrfToken);

    const res = await fetch("/buy/delete", {
        method: "DELETE",
        body: form,
        // FormData ではなく Obejct で送信する場合
        // body: JSON.stringify({
        //     id: elem.dataset.id,
        //     token: csrfToken,
        // })
    }).catch((error) => {
        alert("エラーが発生しました");
        console.log(error);
        return false;
    });
    if (!res.ok) {
        alert("エラーが発生しました");
        return false;
    }

    const total = await res.json();

    // エレメントの削除
    elem.closest(".history-item").remove();

    // 累計金額の修正
    const priceElem = document.getElementsByClassName("total-price-value")[0];
    const formatter = Intl.NumberFormat("ja-JP");
    priceElem.innerHTML = `￥${formatter.format(total)}`;
}