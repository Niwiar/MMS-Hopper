let tbFeedrateDwt, tbFeedrateRec;

const dropdownRecipe = () => {
  $.ajax({
    type: "get",
    url: `/hopper/plan/recipes`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (res) {
      $("#filterRecipe").empty();
      $("#filterRecipe").append(
        `<option value="" selected="">กรุณาเลือกสูตร</option>`
      );
      res.forEach((data) => {
        $("#filterRecipe").append(
          `<option value="${data.RecpNameID}">${data.RecpName}</option>`
        );
      });
      //TODO : Remove this on production
      filterRecipe.val("10");
      filterLotNo.val("23E2112801");
    },
  });
};
const dropdownPlan = (ProdDate) => {
  $.ajax({
    type: "get",
    url: `/hopper/plan?ProdDate=${ProdDate}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (res) {
      $("#filterRecipe").empty();
      $("#filterRecipe").append(`<option value="">กรุณาเลือกสูตร</option>`);
      res
        .filter((data) => data.LotNo)
        .forEach((data, i) => {
          $("#filterRecipe").append(
            `<option value="${data.RecpNameID}" data-lotno="${data.LotNo}" ${
              i == 0 ? "selected" : ""
            }>${data.RecpName}</option>`
          );
        });
      checkRecipe();
    },
  });
};

const getFeedrateRecTable = (ProdDate, RecpNameID) => {
  // if ($.fn.DataTable.isDataTable("#tbFeedrateRec")) {
  //   $("#tbFeedrateRec").dataTable().fnDestroy();
  //   $("#tbFeedrateRec tbody").empty();
  // }
  tbFeedrateRec = $("#tbFeedrateRec").DataTable({
    autoWidth: true,
    ordering: false,
    paging: false,
    searching: false,
    dom: "t",
    // ajax: {
    //   url: `/feedrate/record?ProdDate=${ProdDate}&RecpNameID=${RecpNameID}`,
    //   dataSrc: "",
    // },
    // data: testDataMacList,
    columns: [
      {
        data: "ProdDate",
        render: function (data, type, row) {
          return data;
        },
      },
      {
        data: "Shift",
        render: function (data, type, row) {
          return `<select disabled class="w-auto border rounded form-control form-control-sm" name="Shift">
              <option value="1" ${data == 1 ? "selected" : ""}>1</option>
              <option value="2" ${data == 2 ? "selected" : ""}>2</option>
              <option value="3" ${data == 3 ? "selected" : ""}>3</option>
          </select>`;
        },
      },
      {
        data: "Feedrate",
        render: function (data, type, row) {
          return `<input disabled class="border rounded form-control form-control-sm" type='time' name='Feedrate' value='${data}'>`;
        },
      },
      {
        data: "ProdName",
        render: function (data, type, row) {
          return data || "-";
        },
      },
      {
        defaultContent: `<div>
          <button class="btn btn-success p-0 mx-2 btnSaveRec" data-bss-tooltip="" title="บันทึก" hidden>
            <i class="fa fa-save p-1"></i></button>
          <button class="btn btn-info p-0 mx-2 btnEditRec" data-bss-tooltip="" title="แก้ไข">
            <i class="fa fa-edit p-1"></i></button>
        </div>`,
      },
    ],
  });
};

const getFeedrateDwtTable = (ProdDate, RecpNameID) => {
  // if ($.fn.DataTable.isDataTable("#tbFeedrateDwt")) {
  //   $("#tbFeedrateDwt").dataTable().fnDestroy();
  //   $("#tbFeedrateDwt tbody").empty();
  // }
  tbFeedrateDwt = $("#tbFeedrateDwt").DataTable({
    // scrollY: "300px",
    autoWidth: false,
    ordering: false,
    paging: false,
    searching: false,
    dom: "t",
    // ajax: {
    //   url: `/feedrate/downtime?ProdDate=${ProdDate}&RecpNameID=${RecpNameID}`,
    //   dataSrc: "",
    // },
    // data: testDataMacList,
    columns: [
      {
        data: "Index",
        render: function (data, type, row) {
          return data;
        },
      },
      {
        data: "StartTime",
        render: function (data, type, row) {
          return `<input class="border rounded form-control form-control-sm" type='time' name='StartTime' value='${data}'>`;
        },
      },
      {
        data: "EndTime",
        render: function (data, type, row) {
          return `<input class="border rounded form-control form-control-sm" type='time' name='BatchEndTime' value='${data}'>`;
        },
      },
      {
        data: "Duration",
        render: function (data, type, row) {
          return data || "-";
        },
      },
      {
        data: "Cause",
        render: function (data, type, row) {
          return `<input class="border rounded form-control form-control-sm w-auto" list="feedrateDwtCause" name="Cause" value='${
            data || ""
          }'>`;
        },
      },
    ],
  });
};

const getFeedrateOp = (ProdDate, RecpNameID) => {
  // $('#formFeedrateOp').trigger('reset')
  $.ajax({
    type: "get",
    url: `/feedrate/operator?ProdDate=${ProdDate}&RecpNameID=${RecpNameID}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (res) => {
      $("#formFeedrateOp").data("LogID", res.LogID);
      $("#formFeedrateOp")
        .find("input")
        .toArray()
        .filter(
          (el) =>
            $(el).hasClass("inputLeadUser") || $(el).hasClass("inputLeadDate")
        )
        .forEach((i) => {
          const inputUser = $(i);
          const field = i.id.replace("input", "");
          inputUser.val(res[field]);
          if (res[field + "Name"])
            inputUser.siblings("span").text(`${res[field + "Name"] || ""}`);
          else inputUser.siblings("span").html("&nbsp");
        });
    },
  });
};

const init = () => {
  urlParams.has("ProdDate")
    ? filterProdDate.val(urlParams.get("ProdDate"))
    : filterProdDate.val(date);
  $("#selectedDate").text("-");
  // dropdownRecipe();
  dropdownPlan(filterProdDate.val());

  disabledFilter.attr("disabled", true);
  disabledRec.attr("disabled", true);
};

let filter = $("#filterProdDate,#filterRecipe");
let filterProdDate = $("#filterProdDate");
let filterRecipe = $("#filterRecipe");
let filterLotNo = $("#filterLotNo");
let disabledFilter = $(
  "#buttonFeedrateDwt,#buttonFeedrateOp,.inputLeadUser,.inputLeadDate"
);
let disabledRec = $(
  "#inputRecTime,#inputShift,#inputProdUser,#inputWeight,#inputFeedrate,#buttonFeedrateRec"
);
init();

$("#feedratedowntime").on("shown.bs.collapse", function () {
  if ($.fn.DataTable.isDataTable("#tbFeedrateDwt")) {
    $(`#tbFeedrateDwt`).DataTable().columns.adjust().draw();
  }
});

filterProdDate.on("change", () => {
  dropdownPlan(filterProdDate.val());
  resetFeedrate();
});

filterRecipe.on("change", () => {
  checkRecipe();
});

const checkRecipe = () => {
  const LotNo = filterRecipe.find("option:selected").data("lotno");
  resetFeedrate();
  if (LotNo) {
    filterLotNo.val(LotNo);
    searchFeedrate();
  }
};

function resetFeedrate() {
  filterLotNo.val("");
  $("#formFeedrateOp").trigger("reset");
  $("#formFeedrateOp span").html("&nbsp;");
  if ($.fn.DataTable.isDataTable("#tbFeedrateDwt")) {
    $("#tbFeedrateDwt").dataTable().fnDestroy();
    $("#tbFeedrateDwt tbody").empty();
  }
  if ($.fn.DataTable.isDataTable("#tbFeedrateRec")) {
    $("#tbFeedrateRec").dataTable().fnDestroy();
    $("#tbFeedrateRec tbody").empty();
  }
  $("#tbFeedrateDwt tbody,#tbFeedrateRec tbody").html(`<tr>
      <td colspan="5">กรุณาเลือก Lot</td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
    </tr>`);
  disabledFilter.attr("disabled", true);
}

function searchFeedrate() {
  // e.preventDefault();
  const fProdDate = filterProdDate.val(),
    fRecpNameID = filterRecipe.val(),
    fLotNo = filterLotNo.val();

  $("#selectedDate").text(dymDate(fProdDate));
  $("#inputRecTime").val(dateTime);
  // getFeedrateDwtTable(fProdDate, fRecpNameID);
  // getFeedrateRecTable(fProdDate, fRecpNameID);
  // getFeedrateOp(fProdDate, fRecpNameID);
  disabledFilter.removeAttr("disabled");
  disabledRec.removeAttr("disabled");

  $(".inputLeadUser").off("change");
  $(".inputLeadUser").on("change", function () {
    const inputUser = $(this);
    inputUser.siblings("span").html("&nbsp");
    $.ajax({
      type: "get",
      url: `/hopper/plan/user?Username=${inputUser.val()}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (res) => {
        inputUser
          .siblings("span")
          .text(`${res.Name || "-"} ${res.Surname || ""}`);
      },
    });
  });
  $("#buttonFeedrateOp").off("click");
  $("#buttonFeedrateOp").on("click", (e) => {
    e.preventDefault();
    let data = { LogID: $("#formFeedrateOp").data("LogID") };
    $("#formFeedrateOp")
      .find("input")
      .toArray()
      .filter(
        (el) =>
          $(el).hasClass("inputLeadUser") || $(el).hasClass("inputLeadDate")
      )
      .forEach((i) => {
        const inputElem = $(i);
        data[inputElem.attr("id").replace("input", "")] = inputElem.val();
      });
    console.log(data);
    // $.ajax({
    //   url: `/feedrate/operator?ProdDate=${fProdDate}&RecpNameID=${fRecpNameID}`,
    //   type: "PUT",
    //   contentType: "application/json",
    //   data: JSON.stringify(data),
    //   beforeSend: () => Swal.showLoading(),
    // })
    //   .fail((err) =>
    //     Swal.fire({
    //       icon: "error",
    //       title: "Save Failed",
    //       text: err.responseJSON.message,
    //     })
    //   )
    //   .done(() => {
    //     tbFeedrateDwt.ajax.reload(null, false);
    //     Swal.fire({
    //       icon: "success",
    //       title: "Success",
    //       text: "บันทึกข้อมูลสำเร็จ",
    //     });
    //   });
  });

  $("#buttonFeedrateDwt").off("click");
  $("#buttonFeedrateDwt").on("click", (e) => {
    e.preventDefault();
    let logIDArr = tbFeedrateDwt
      .rows()
      .data()
      .toArray()
      .map((el) => el.LogID);
    let inputArr = $("#tbFeedrateDwt tbody")
      .find("input")
      .toArray()
      .map((el) => {
        let elem = $(el);
        return { key: elem.attr("name"), value: elem.val() };
      });
    let causeArr = $("#feedrateDwtCause")
      .find("option")
      .toArray()
      .map((el) => $(el).val());
    let Downtimes = [],
      id = 0;
    const chunkSize = 3;

    for (let i = 0; i < inputArr.length; i += chunkSize) {
      const chunk = inputArr.slice(i, i + chunkSize);
      Downtimes.push({
        LogID: logIDArr[id],
        StartTime: chunk[0].value,
        EndTime: chunk[1].value,
        IsOther: causeArr.some((cause) => cause == chunk[2].value) ? 0 : 1,
        Cause: chunk[2].value,
      });
      id++;
    }
    // $.ajax({
    //   url: `/feedrate/downtime?ProdDate=${fProdDate}`,
    //   type: "PUT",
    //   contentType: "application/json",
    //   data: JSON.stringify({ Downtimes }),
    //   beforeSend: () => Swal.showLoading(),
    // })
    //   .fail((err) =>
    //     Swal.fire({
    //       icon: "error",
    //       title: "Save Failed",
    //       text: err.responseJSON.message,
    //     })
    //   )
    //   .done(() => {
    //     tbFeedrateDwt.ajax.reload(null, false);
    //     Swal.fire({
    //       icon: "success",
    //       title: "Success",
    //       text: "บันทึกข้อมูลสำเร็จ",
    //     });
    //   });
  });

  $("#inputWeight").off("keyup change");
  $('#inputWeight').on('keyup change',()=>{
    const weight = $('#inputWeight').val();
    $('#inputFeedrate').val(weight*6);
  })

  $("#inputProdUser").off("change");
  $("#inputProdUser").on("change", () => {
    $("#textProdName").text("");
    $.ajax({
      type: "get",
      url: `/hopper/plan/user?Username=${$("#inputProdUser").val()}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (res) => {
        $("#textProdName").text(`${res.Name || "-"} ${res.Surname || ""}`);
      },
    });
  });

  $("#buttonFeedrateRec").off("click");
  $("#buttonFeedrateRec").on("click", (e) => {
    e.preventDefault();

    const data = {
      ProdDate: fProdDate,
      RecpNameID: fRecpNameID,
      Shift: $("#inputShift").val(),
      ProdUser: $("#inputProdUser").val(),
      RecTime: $("#inputRecTime").val(),
      Feedrate: $("#inputFeedrate").val(),
    };
    disabledRec.attr("disabled", true);
    // saveFeedrateRec("POST", data);
  });

  $("#tbFeedrateRec").off("click", ".btnEditRec");
  $("#tbFeedrateRec").on("click", ".btnEditRec", function (e) {
    let tr = $($(this).closest("tr"));
    tr.find("input").removeAttr("disabled");
    tr.find("select").removeAttr("disabled");
    tr.find(".btnSaveRec").removeAttr("hidden");
    tr.find(".btnEditRec").attr("hidden", true);

    $("#tbFeedrateRec").off("click", ".btnSaveRec");
    $("#tbFeedrateRec").on("click", ".btnSaveRec", function (e) {
      let tr = $(this).closest("tr");
      let input = $(tr).find("input").toArray();
      let select = $(tr).find("select").toArray();
      let data = { 
      ProdDate: fProdDate,
      LogID: tbFeedrateRec.row(tr).data().LogID
       };
      input.forEach((el) => (data[`${$(el).attr("name")}`] = $(el).val()));
      select.forEach((el) => (data[`${$(el).attr("name")}`] = $(el).val()));
      $(tr).find("input").attr("disabled", true);
      $(tr).find("select").attr("disabled", true);
      $(tr).find(".btnSaveRec").attr("hidden", true);
      $(tr).find(".btnEditRec").removeAttr("hidden");
      // saveFeedrateRec("PUT", data);
    });
  });
}

const saveFeedrateRec = (type, data) => {
  $.ajax({
    url: `/feedrate/record`,
    type,
    contentType: "application/json",
    data: JSON.stringify(data),
    beforeSend: () => Swal.showLoading(),
  })
    .fail((err) => {
      disabledRec.removeAttr("disabled");
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.responseJSON.message,
      });
    })
    .done(() => {
      disabledRec.removeAttr("disabled");
      tbFeedrateRec.ajax.reload(null, false);
      if (type == "POST") {
        $("#formFeedrateRec").trigger("reset");
        $("#textProdName").text("");
      }
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "บันทึกข้อมูลสำเร็จ",
      });
    });
};
