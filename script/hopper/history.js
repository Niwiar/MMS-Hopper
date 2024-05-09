let tbHopperDwt, tbHopperRec;

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

const getHopperRecTable = (ProdDate, RecpNameID) => {
  // if ($.fn.DataTable.isDataTable("#tbHopperRec")) {
  //   $("#tbHopperRec").dataTable().fnDestroy();
  //   $("#tbHopperRec tbody").empty();
  // }
  tbHopperRec = $("#tbHopperRec").DataTable({
    autoWidth: true,
    ordering: false,
    paging: false,
    searching: false,
    dom: "t",
    ajax: {
      url: `/hopper/record?ProdDate=${ProdDate}&RecpNameID=${RecpNameID}`,
      dataSrc: "",
    },
    // data: testDataMacList,
    columns: [
      {
        data: "ProdDate",
        render: function (data, type, row) {
          return data;
        },
      },
      {
        data: "BatchNo",
        render: function (data, type, row) {
          return data;
        },
      },
      {
        data: "Shift",
        render: function (data, type, row) {
          return data;
        },
      },
      {
        data: "StartTime",
        render: function (data, type, row) {
          return data ? data.slice(0, 5) : "-";
        },
      },
      {
        data: "BatchEndTime",
        render: function (data, type, row) {
          return data ? data.slice(0, 5) : "-";
        },
      },
      {
        data: "Duration",
        render: function (data, type, row) {
          return data || "-";
        },
      },
      {
        data: "ProdName",
        render: function (data, type, row) {
          return data || "-";
        },
      },
    ],
  });
};

const getHopperDwtTable = (ProdDate, RecpNameID) => {
  // if ($.fn.DataTable.isDataTable("#tbHopperDwt")) {
  //   $("#tbHopperDwt").dataTable().fnDestroy();
  //   $("#tbHopperDwt tbody").empty();
  // }
  tbHopperDwt = $("#tbHopperDwt").DataTable({
    // scrollY: "300px",
    autoWidth: false,
    ordering: false,
    paging: false,
    searching: false,
    dom: "t",
    ajax: {
      url: `/hopper/downtime?ProdDate=${ProdDate}&RecpNameID=${RecpNameID}`,
      dataSrc: "",
    },
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
          return data ? data.slice(0, 5) : "-";
        },
      },
      {
        data: "EndTime",
        render: function (data, type, row) {
          return data ? data.slice(0, 5) : "-";
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
          return data || "-";
        },
      },
    ],
  });
};

const getHopperOp = (ProdDate, RecpNameID) => {
  // $('#formHopperOp').trigger('reset')
  $.ajax({
    type: "get",
    url: `/hopper/operator?ProdDate=${ProdDate}&RecpNameID=${RecpNameID}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (res) => {
      $("#formHopperOp").data("LogID", res.LogID);
      $("#formHopperOp")
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

const urlParams = new URLSearchParams(window.location.search);

const init = () => {
  urlParams.has("ProdDate")
    ? filterProdDate.val(urlParams.get("ProdDate"))
    : filterProdDate.val(date);
  $("#selectedDate").text("-");
  // dropdownRecipe();
  dropdownPlan(filterProdDate.val());

  disabledFilter.attr("disabled", true);
};

let filter = $("#filterProdDate,#filterRecipe");
let filterProdDate = $("#filterProdDate");
let filterRecipe = $("#filterRecipe");
let filterLotNo = $("#filterLotNo");
let disabledFilter = $(
  "#inputQrCode,#buttonHopperDwt,#buttonHopperOp,.inputLeadUser,.inputLeadDate"
);
init();

$("#hopperdowntime").on("shown.bs.collapse", function () {
  if ($.fn.DataTable.isDataTable("#tbHopperDwt")) {
    $(`#tbHopperDwt`).DataTable().columns.adjust().draw();
  }
});

filterProdDate.on("change", () => {
  dropdownPlan(filterProdDate.val());
  resetHopper();
});

filterRecipe.on("change", () => {
  checkRecipe();
});

const checkRecipe = () => {
  const LotNo = filterRecipe.find("option:selected").data("lotno");
  resetHopper();
  if (LotNo) {
    filterLotNo.val(LotNo);
    searchHopper();
  }
};

function resetHopper() {
  // Swal.fire({
  //   icon: "error",
  //   title: "Select Lot Failed",
  //   text: "ไม่พบ Lot No.",
  // });
  filterLotNo.val("");
  $("#formHopperOp").trigger("reset");
  $("#formHopperOp span").html("&nbsp;");
  if ($.fn.DataTable.isDataTable("#tbHopperDwt")) {
    $("#tbHopperDwt").dataTable().fnDestroy();
    $("#tbHopperDwt tbody").empty();
  }
  if ($.fn.DataTable.isDataTable("#tbHopperRec")) {
    $("#tbHopperRec").dataTable().fnDestroy();
    $("#tbHopperRec tbody").empty();
  }
  $("#tbHopperDwt tbody").html(`<tr>
      <td colspan="5">กรุณาเลือก Lot</td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
    </tr>`);
  $("#tbHopperRec tbody").html(`<tr>
      <td colspan="8">กรุณาเลือก Lot</td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
      <td hidden></td>
    </tr>`);
  disabledFilter.attr("disabled", true);
}

function searchHopper() {
  // e.preventDefault();
  const fProdDate = filterProdDate.val(),
    fRecpNameID = filterRecipe.val(),
    fLotNo = filterLotNo.val();

  getHopperDwtTable(fProdDate, fRecpNameID);
  getHopperRecTable(fProdDate, fRecpNameID);
  getHopperOp(fProdDate, fRecpNameID);
  disabledFilter.removeAttr("disabled");

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
  $("#buttonHopperOp").off("click");
  $("#buttonHopperOp").on("click", (e) => {
    e.preventDefault();
    let data = { LogID: $("#formHopperOp").data("LogID") };
    $("#formHopperOp")
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
    $.ajax({
      url: `/hopper/operator?ProdDate=${fProdDate}&RecpNameID=${fRecpNameID}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(data),
      beforeSend: () => Swal.showLoading(),
    })
      .fail((err) =>
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: err.responseJSON.message,
        })
      )
      .done(() => {
        tbHopperDwt.ajax.reload(null, false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "บันทึกข้อมูลสำเร็จ",
        });
      });
  });

  $("#tbHopperRec").off("click", ".btnEditRec");
  $("#tbHopperRec").on("click", ".btnEditRec", function (e) {
    let tr = $($(this).closest("tr"));
    tr.find("input").removeAttr("disabled");
    tr.find("select").removeAttr("disabled");
    tr.find(".btnSaveRec").removeAttr("hidden");
    tr.find(".btnEditRec").attr("hidden", true);

    $("#tbHopperRec").off("click", ".btnSaveRec");
    $("#tbHopperRec").on("click", ".btnSaveRec", function (e) {
      let tr = $(this).closest("tr");
      let input = $(tr).find("input").toArray();
      let select = $(tr).find("select").toArray();
      let data = { LogID: tbHopperRec.row(tr).data().LogID };
      input.forEach((el) => (data[`${$(el).attr("name")}`] = $(el).val()));
      select.forEach((el) => (data[`${$(el).attr("name")}`] = $(el).val()));
      $(tr).find("input").attr("disabled", true);
      $(tr).find("select").attr("disabled", true);
      $(tr).find(".btnSaveRec").attr("hidden", true);
      $(tr).find(".btnEditRec").removeAttr("hidden");
      saveHopperRec("PUT", data);
    });
  });
}

const saveHopperRec = (type, data) => {
  $.ajax({
    url: `/hopper/record`,
    type,
    contentType: "application/json",
    data: JSON.stringify(data),
    beforeSend: () => Swal.showLoading(),
  })
    .fail((err) => {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.responseJSON.message,
      });
    })
    .done(() => {
      tbHopperRec.ajax.reload(null, false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "บันทึกข้อมูลสำเร็จ",
      });
    });
};
