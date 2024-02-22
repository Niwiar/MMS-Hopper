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
      $("#filterRecipe").append(
        `<option value="" selected="">กรุณาเลือกสูตร</option>`
      );
      res.forEach((data) => {
        if (data.LotNo)
          $("#filterRecipe").append(
            `<option value="${data.RecpNameID}" data-lotno="${data.LotNo}">${data.RecpName}</option>`
          );
      });
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
          return `<input disabled class="border rounded form-control form-control-sm" type='time' name='StartTime' value='${data}'>`;
        },
      },
      {
        data: "BatchEndTime",
        render: function (data, type, row) {
          return `<input disabled class="border rounded form-control form-control-sm" type='time' name='BatchEndTime' value='${data}'>`;
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
          return `<input class="border rounded form-control form-control-sm w-auto" list="hopperDwtCause" name="Cause" value='${
            data || ""
          }'>`;
        },
      },
    ],
  });
};

const getHopperOp = (ProdDate,RecpNameID)=>{
  // $('#formHopperOp').trigger('reset')
  $.ajax({
    type: "get",
    url: `/hopper/operator?ProdDate=${ProdDate}&RecpNameID=${RecpNameID}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: (res) => {
      $('#formHopperOp').data('LogID',res.LogID)
      $('#formHopperOp').find('input').toArray()
        .filter((el)=>$(el).hasClass('inputLeadUser')||$(el).hasClass('inputLeadDate'))
        .forEach((i)=>{
          const inputUser =  $(i)
          const field = i.id.replace('input','')
          inputUser.val(res[field])
          if(res[field+'Name'])
            inputUser.siblings("span").text(`${res[field+'Name'] || ""}`);
          else
            inputUser.siblings("span").html("&nbsp")
        })
    },
  });
}

const init = () => {
  filterProdDate.val(date);
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
  "#inputQrCode,#buttonHopperDwt,#buttonHopperOp,.inputLeadUser,.inputLeadDate"
);
let disabledRec = $(
  "#inputShift,#inputProdUser,#inputStartTime,#inputBatchEndTime,#buttonHopperRec"
);
init();

$("#hopperdowntime").on("shown.bs.collapse", function () {
  if ($.fn.DataTable.isDataTable("#tbHopperDwt")) {
    $(`#tbHopperDwt`).DataTable().columns.adjust().draw();
  }
});

filterProdDate.on("change", () => {
  dropdownPlan(filterProdDate.val());
  resetHopper()
});

filterRecipe.on("change", () => {
  const LotNo = filterRecipe.find("option:selected").data("lotno");
  resetHopper()
  if(LotNo){
    filterLotNo.val(LotNo);
    searchHopper()
  }
});

// filter.on("change", () => {
//   if (filterProdDate.val() && filterRecipe.val())
//     $.ajax({
//       type: "get",
//       url: `/hopper/plan/lot?ProdDate=${filterProdDate.val()}&RecpNameID=${filterRecipe.val()}`,
//       contentType: "application/json; charset=utf-8",
//       dataType: "json",
//       success: (res) => {
//         filterLotNo.val(res.LotNo);
//       },
//     });
// });

function resetHopper(){
  // Swal.fire({
  //   icon: "error",
  //   title: "Select Lot Failed",
  //   text: "ไม่พบ Lot No.",
  // });
  filterLotNo.val('')
  $('#formHopperOp').trigger('reset')
  $('#formHopperOp span').html('&nbsp;')
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
      <td hidden></td>
    </tr>`);
  disabledFilter.attr("disabled", true);
  disabledRec.attr("disabled", true);
}

function searchHopper(){
  // e.preventDefault();
  const fProdDate = filterProdDate.val(),
    fRecpNameID = filterRecipe.val(),
    fLotNo = filterLotNo.val();

  $("#selectedDate").text(dymDate(fProdDate));
  getHopperDwtTable(fProdDate, fRecpNameID);
  getHopperRecTable(fProdDate, fRecpNameID);
  getHopperOp(fProdDate, fRecpNameID)
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
    let data ={LogID:$('#formHopperOp').data('LogID')}
    $('#formHopperOp').find('input').toArray()
      .filter((el)=>$(el).hasClass('inputLeadUser')||$(el).hasClass('inputLeadDate'))
      .forEach((i)=>{
        const inputElem = $(i)
        data[inputElem.attr('id').replace('input','')]=inputElem.val()
      })
      console.log(data)
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

  $("#buttonHopperDwt").off("click");
  $("#buttonHopperDwt").on("click", (e) => {
    e.preventDefault();
    let logIDArr = tbHopperDwt
      .rows()
      .data()
      .toArray()
      .map((el) => el.LogID);
    let inputArr = $("#tbHopperDwt tbody")
      .find("input")
      .toArray()
      .map((el) => {
        let elem = $(el);
        return { key: elem.attr("name"), value: elem.val() };
      });
    let causeArr = $("#hopperDwtCause")
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
    $.ajax({
      url: `/hopper/downtime?ProdDate=${fProdDate}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ Downtimes }),
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

  $("#inputQrCode").off("keyup change");
  $("#inputQrCode").on("keyup change", () => {
    disabledRec.attr("disabled", true);
    const QrCode = $("#inputQrCode").val().split("-");
    // LotNo-RecpNameID-BatchNo-LogRawMatBatchGrind_LogID:23E2112801-010-001-001
    // 190254
    console.log(QrCode);
    if (QrCode.length !== 4) {
      Swal.fire({
        icon: "error",
        title: "Scan Failed",
        text: "QR Code ไม่ถูกต้อง",
      });
      $("#inputQrCode").val("");
      return;
    } else if (QrCode[0] !== fLotNo) {
      Swal.fire({
        icon: "error",
        title: "Scan Failed",
        text: "Lot การผลิตไม่ถูกต้อง",
      });
      $("#inputQrCode").val("");
      return;
    } else if (fRecpNameID != parseInt(QrCode[1])) {
      Swal.fire({
        icon: "error",
        title: "Scan Failed",
        text: "สูตรไม่ถูกต้อง",
      });
      $("#inputQrCode").val("");
      return;
    }
    $("#inputLotNo").val(QrCode[0]);
    $("#inputProdDate").val(fProdDate);
    $("#inputBatchNo").val(parseInt(QrCode[2]));
    $("#inputRecpName").val(
      $("#filterRecipe")
        .find(`option[value="${parseInt(QrCode[1])}"]`)
        .text()
    );

    $("#inputQrCode").val("");
    disabledRec.removeAttr("disabled");

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
  });

  $("#buttonHopperRec").off("click");
  $("#buttonHopperRec").on("click", (e) => {
    e.preventDefault();

    const data = {
      ProdDate: fProdDate,
      RecpNameID: fRecpNameID,
      LotNo: $("#inputLotNo").val(),
      BatchNo: $("#inputBatchNo").val(),
      Shift: $("#inputShift").val(),
      ProdUser: $("#inputProdUser").val(),
      StartTime: $("#inputStartTime").val(),
      BatchEndTime: $("#inputBatchEndTime").val(),
    };
    disabledRec.attr("disabled", true);
    saveHopperRec("POST", data);
  });

  $("#tbHopperRec").off("click", ".btnEditRec");
  $("#tbHopperRec").on("click", ".btnEditRec", function (e) {
    let tr = $($(this).closest("tr"));
    tr.find("input").removeAttr("disabled");
    tr.find(".btnSaveRec").removeAttr("hidden");
    tr.find(".btnEditRec").attr("hidden", true);

    $("#tbHopperRec").off("click", ".btnSaveRec");
    $("#tbHopperRec").on("click", ".btnSaveRec", function (e) {
      let tr = $(this).closest("tr");
      let input = $(tr).find("input").toArray();
      let data = { LogID: tbHopperRec.row(tr).data().LogID };
      input.forEach((el) => (data[`${$(el).attr("name")}`] = $(el).val()));
      console.log(data);
      $(tr).find("input").attr("disabled", true);
      $(tr).find(".btnSaveRec").attr("hidden", true);
      $(tr).find(".btnEditRec").removeAttr("hidden");
      saveHopperRec("PUT", data);
    });
  });
};

const saveHopperRec = (type, data) => {
  $.ajax({
    url: `/hopper/record`,
    type,
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
      tbHopperRec.ajax.reload(null, false);
      if(type=='POST') $('#formHopperRec').trigger('reset')
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "บันทึกข้อมูลสำเร็จ",
      });
    });
};
