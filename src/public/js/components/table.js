$(document).ready(function () {
  const tableHeads = $(".thead-check-all");
  tableHeads.each((index, thead) => {
    const checkAllBox = $(thead).find("#check-all");
    const tableBody = $($(checkAllBox).attr("body-target"));
    const checkboxs = tableBody.find("input[name='check-arr[]']");
    const hideOnChecked = $(thead).find(".hide-on-checked");
    const showOnChecked = $(thead).find(".show-on-checked");
    const amountCol = $(thead).find(".amount-col");

    // for check all 
    checkAllBox.on("change", function() {
      const isChecked = $(this).prop("checked");
      checkboxs.prop("checked", isChecked);
      if (isChecked){
        hideOnChecked.addClass("d-none");
        showOnChecked.removeClass("d-none");
        amountCol.html(`(${checkboxs.length}) dòng được chọn`);
      } else {
        hideOnChecked.removeClass("d-none");
        showOnChecked.addClass("d-none");
      }

    });

    checkboxs.on("change", function() {
      const checkedBoxs = tableBody.find("input[name='check-arr[]']:checked");
      checkAllBox.prop("checked", checkedBoxs.length===checkboxs.length);
      if (checkedBoxs.length){
        hideOnChecked.addClass("d-none");
        showOnChecked.removeClass("d-none");
        amountCol.html(`(${checkedBoxs.length}) dòng được chọn`);
      } else {
        hideOnChecked.removeClass("d-none");
        showOnChecked.addClass("d-none");
      }
    });
  })
});