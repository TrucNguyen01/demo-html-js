$(document).ready(function() {
    // Load dữ liệu lên bảng:
    loadData();

    // Khai báo biến lưu trữ dữ liệu thông báo lỗi khách hàng khi nhập
    var listlabelinputerror = "";
    var elementErrorInput = {};

    // Khai báo trạng thái để thêm hoặc sửa dữ liệu
    var statusCode = status.insert;

    // Khai báo biến gắn customerid dùng để update
    var customerIdUpdate = "";

    // Khai báo và hiển thị số lượng bản ghi được chọn lúc đầu
    var amount = 0;
    ReLoadQuantity(amount);
   
    

    //Hiển thị form nhập khách hàng khi nhấn vào nút thêm mới nhân viên
    $(".btn-add-customer").on("click", function() {
        statusCode = status.insert;
        showDetaiCustomer();
    })
 
    // Đóng form khách hàng khi khách hàng nhẫn dấu X
    $(".show-customer .icon-close").on("click", function() {
        HideDetaiCustomer();
    })

    //// Đóng form khách hàng khi khách hàng nhẫn nút huỷ
    $(".show-customer .m-button-cancel").on("click", function() {
        HideDetaiCustomer();
    })

    // Toast

    // Đóng toast khi thêm bản ghi thành công
    $(".close-toast-successful").on("click", function() {
        (".add-customer-success").hide();
    })

    // Đóng toast khi xoá dữ liệu thành công
    $(".delete-data").on("click", function() {
        (".delete-data").hide();
    });


    // Load lại trang
    $(".icon-reload").on("click", function() {
        // gọi function xoá icon-paging
        removeIconPaging();

        // load data
        loadData();
    });


    // Thêm khách hàng:
    $(".btn-success").on("click", function() {
        try { 
            // Lấy dữ liệu từ form về:
            var customerCode = $("#customerCode").val();
            var customerName = $("#customerName").val();
            var customerPhoneNumber = $("#customerPhoneNumber").val();
            var customerEmail = $("#customerEmail").val();
            var dateOfBirth = $("#dateOfBirth").val();
            var gender = $("input[name='gender']:checked").val();
            var idCard = $("#idCard").val();
            var dateRange = $("#dateRange").val();
            var loan = $("#loan").val();
            var company = $("#company").val();
            var addressCompany = $("#addressCompany").val();

            // Tạo object:
            let customer = {
                "CustomerCode": customerCode,
                "FullName": customerName,
                "PhoneNumber": customerPhoneNumber,
                "Email": customerEmail,
                "DateOfBirth": dateOfBirth,
                "Gender": gender,
                "DebitAmount": loan,
                "CompanyName": company,
                "Address": addressCompany
            }

            


            // Lấy ra các input bắt buộc nhập trong form .show-customer
            var listInput = document.querySelectorAll(".show-customer input[required]");
            
            // Duyệt từng input thông báo lỗi bắt buộc nhập
            listInput.forEach(validateInput);
            

            // Ngày nhập không được lớn hơn ngày hiện tại
            var listdate = document.querySelectorAll(".show-customer input[date]");

            // Duyệt từng date
            listdate.forEach(validateInputDate);

            
            //  Kiểm tra có lỗi xảy ra không  
            if(listlabelinputerror.length !== 0) {

                // Hiện thị dialog thông báo lỗi cho khách hàng
                errormessage(".dialog-delete-customer", errorCustomer);

                // Gắn content cho dialog hiển thị những lỗi khi nhập
                $(".dialog-delete-customer .content-dialog").append(listlabelinputerror);

                // chấp nhận
                $(".dialog-delete-customer .m-button-success").on("click", function() {
                    // Thoát form và focus vào ô lỗi đầu tiên
                    focuserrorfirst();
                })

                $(".dialog-delete-customer .cancel-delete").on("click", function() {
                    // Thoát form và focus vào ô lỗi đầu tiên
                    focuserrorfirst();
                })
            }
            else  {
                // Nếu không có lỗi xảy ra

                // Hiển thị form message xác nhận có muốn thêm không
                errormessage(".dialog-delete-customer", comfirmCustomer)

                // Nếu đồng ý lưu dữ liệu
                $(".dialog-delete-customer .m-button-success").on("click", function() {
                    // Đóng form
                    $(".dialog-delete-customer").hide();

                    // Hiện thị load dự liệu: 
                    $(".m-loading").show();

                    // Load api để thực hiện yêu cầu:
                    if(statusCode === status.insert) {
                        $.ajax({
                            type: "POST",
                            url: "https://cukcuk.manhnv.net/api/v1/Customers",
                            data: JSON.stringify(customer),
                            dataType: "json",
                            contentType: "application/json",
                            success: function (response) {
                                implementsuccess();
                            },
                            error: function(response) {
                                implementerror(response);
                            }
                        });
                    }
                    else {
                        $.ajax({
                            type: "PUT",
                            url: `https://cukcuk.manhnv.net/api/v1/Customers/${customerIdUpdate}`,
                            data: JSON.stringify(customer),
                            dataType: "json",
                            contentType: "application/json",
                            success: function (response) {
                                implementsuccess();
                            },
                            error: function(response) {
                                implementerror(response);
                            }
                        });
                    }
                })            
            }  
        }
        catch(error) {
            console.log(error);
        }
    });

    // Function hiển thị dialog thông báo lỗi
    function errormessage(className, dialog) {
        try {
            // Hiển thị form message yêu cầu xác nhận
            $(className).show();

            // Gắn tiêu đề có diaglog
            $(className + " .header-dialog-title").text(dialog.title);

            // Gắn content cho dialog
            $(className + " .content-dialog").text(dialog.content);
            $(className + " .icon-question").hide()
            $(className + " .content-dialog").css({"padding-bottom": "60px"});

            // nếu ấn nút huỷ hoặc dấu x để thoát form
            $(className + " .cancel-delete").on("click", function() {
                // Thoát form
                $(className).hide();
            })
        }
        catch(error) {
            console.log(error);
        }
    }

    // Function sau khi thực hiện chức vụ thành công(thêm, sửa):
    function implementsuccess() {
        try {
            // Hiển thị toast sau khi thêm bản ghi thành công
            $(".add-customer-success").show();

            // Tự động ẩn toast sau khi hiển thị
            setTimeout(() => {
                $(".add-customer-success").fadeToggle(1500);
            }, 1500);

            // Ẩn form chi tiết khách hàng
            HideDetaiCustomer();

            // Load lại dữ liệu sau khi thêm mới thành công
            loadData();

            // gọi function xoá icon-paging
            removeIconPaging();
        }
        catch(error) {
            console.log(error);
        }
    }

    // Function sau khi thực hiện chức vụ thất bại(thêm, sửa):
    function implementerror(response) {
        try {
            if(response.responseJSON.userMsg) {
                errormessageapi.content = response.responseJSON.userMsg;
            }
            else if(response.status === 400) {
                errormessageapi.content = response.responseJSON.errors.CustomerCode[0];
            }
            else {
                errormessageapi.content = response.responseJSON.errors.Email[0];
            }
    
            // Gọi function hiển thị thông báo lỗi trả về từ api:
            errormessage(".dialog-error-api", errormessageapi);
            $(".m-loading").hide();
    
            // nếu ấn nút đồng ý sẽ thoát form thông báo
            $(".dialog-error-api .accept").on("click", function() {
                // Thoát form
                $(".dialog-error-api").hide();
            })
        }
        catch(error) {
            console.log(error);
        }
    }

    // Validate input có attribute là required
    function validateInput(item) {
        try {
            // Lấy ra giá trị của input
            let value = item.value;

            // Tạo để hiển thị thông báo lỗi khi nhập
            let stringli = `<li style="color: red">${item.previousElementSibling.textContent} ${errorCustomer.contentrequired}</li>`;
            
            if(value === null || value === "" || value === undefined) {
                // nếu có lỗi
                checkederror(item, errorCustomer.contentrequired, stringli);
            }
            else {
                // Xoá hiển thị lỗi
                checkednoerror(item, stringli);
            }
        }
        catch(error) {
            console.log(error);
        }
    }


    //Validate date input
    function validateInputDate(item) {
        try {
            var value = item.value;
            let stringli = `<li style="color: red">${item.previousElementSibling.textContent} ${errorCustomer.contentdate}</li>`;

            if(value) {
                value = new Date(value);

                if(value > new Date()) {
                    // nếu có lỗi
                    checkederror(item, errorCustomer.contentdate, stringli);
                }
                else {
                    // Xoá hiển thị lỗi
                    checkednoerror(item, stringli);
                }
            }
        }
        catch(error) {
            console.log(error);
        }
    };

    // Function check nếu có lỗi xảy ra
    function checkederror(item, typeerror, stringli) {
        try {
            //Kiểm tra xem elementError đã tồn tại chưa
            if(!item.nextElementSibling) {
                listlabelinputerror = listlabelinputerror + stringli;

                var errorElement = document.createElement("div");
                errorElement.style.color = "red";
                errorElement.style.width = "320px";
                errorElement.style.position = "absolute";
                errorElement.textContent = `Thông tin ${typeerror}`;
                $(item).addClass("m-input-error");
                $(item).attr("title", typeerror);
                $(item).after(errorElement);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // Function kiểm tra nếu đã nhập dữ liệu thì xoá thông báo lỗi trước đi
    function checkednoerror(item, stringli) {
        try {
            if(item.nextElementSibling) {
                $(item).removeClass("m-input-error");
                $(item).removeAttr("title");
                
                listlabelinputerror = listlabelinputerror.replace(stringli, "")
                // Xoá element sau nó nếu khách hàng nhập dữ liệu
                item.nextElementSibling.remove();
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    //Hiển thị lỗi thông báo với các trường bắt buộc và tắt khi nhập dữ liệu:
    $("input[required]").blur(function() {
        validateInput(this);
    });

    //Hiển thị lỗi thông báo với ngày nhập > ngày hiên tại:
    $("input[date]").blur(function() {
        validateInputDate(this);
    });

    // Khi đóng form hiển thị lỗi focus vào ô error đầu tiên:
    function focuserrorfirst() {
        try {
            $(".dialog-delete-customer").hide();
            var elmenterrorfirst = document.querySelector(".m-input-error");
            if(elmenterrorfirst) {
                elmenterrorfirst.focus();
            }
        }
        catch(error) {
            console.log(error);
        }
    }


    // Hiển thị form khi click 2 lần vào tr
    $(".tbl-employee tbody").on("dblclick", "tr", function() {
        try {
            // Lấy ra customer bấm vào
            var customer = $(this).data("customer");

            // Gán id customer để update
            customerIdUpdate = customer.CustomerId;

            // Gán lại trạng thái
            statusCode = status.update;
            

            $("#customerCode").val(customer.CustomerCode);
            $("#customerName").val(customer.FullName);
            $("#customerPhoneNumber").val(customer.PhoneNumber);
            $("#customerEmail").val(customer.Email);
            $("#dateOfBirth").val(customer.DateOfBirth);
            $("gender").val(customer.Gender);
            $("#idCard").val();
            $("#dateRange").val();
            $("#placeOfIssuance").val();
            $("#loan").val(customer.DebitAmount);
            $("#company").val(customer.CompanyName);
            $("#addressCompany").val(customer.Address);

            showDetaiCustomer();
        }
        catch(error) {
            console.log(error);
        }
    })



    // Click chọn hàng trong table
    $(".tbl-employee tbody").on("click", "tr", function() {
        try {
            // Check xem class đax tồn tại chưa
            if(!$(this).hasClass("isSelected")) {
                // Tăng số lượng bản ghi được chọn
                amount = amount + 1;
                ReLoadQuantity(amount);

                // Add class vào trong tr
                $(this).addClass("isSelected");
                this.firstElementChild.firstElementChild.toggleAttribute('checked', true);
            }
            else {
                // Giảm số lượng bản ghi được chọn
                amount = amount - 1;
                ReLoadQuantity(amount);

                // Xoá class trong thẻ tr
                $(this).removeClass("isSelected");
                this.firstElementChild.firstElementChild.toggleAttribute('checked', false);
            }
        }
        catch(error) {
            console.log(error);
        }
    });

    // Bỏ chọn các hàng đã chọn
    $(".clear-selected").on("click", function() {
       try {
            // Reset lại số lượng bản ghi đã chọn
            ReLoadQuantity(0);

            // Xoá class cho các tr được chọn
            $(".tbl-employee tbody tr").removeClass("isSelected");
            
            // Lấy ra list input và bỏ chọn
            selectedAll(".input-checkbox", clearSelected)
        }
        catch(error) {
            console.log(error);
        }
    });


    // Chọn tất cả bản ghi
    $(".tbl-employee thead tr th").on("click", function() {
        try {
            if(!$(this).hasClass("ok")) {
                this.firstElementChild.toggleAttribute('checked', true);
                $(this).addClass("ok");
    
                var list = document.querySelectorAll(".input-checkbox.td")
                amount = list.length;
                
                // Lấy ra list input phần tbody
                selectedAll(".input-checkbox.td", selectAll)
    
                // Hiển thị số lượng tất cả bản ghi
                reLoadTotal("number-records");
            }
            else {
                this.firstElementChild.toggleAttribute('checked', false);
                $(this).removeClass("ok");
    
                // Reset lại số lượng bản ghi đã chọn
                ReLoadQuantity(0);
    
                // Xoá class cho các tr được chọn
                $(".tbl-employee tbody tr").removeClass("isSelected");
                
                // Lấy ra list input và bỏ chọn
                selectedAll(".input-checkbox", clearSelected)
            }
        }
        catch(error) {
            console.log(error);
        }
    })

    // Function giúp chọn hết bản ghi
    function selectAll(item) {
        item.toggleAttribute('checked', true);
        item.parentElement.parentElement.classList.add("isSelected");
    }

    // Function được gọi để lấy ra các input và bỏ chọn
    function clearSelected(item) {
        item.toggleAttribute('checked', false);
    }

    // Xoá dữ liệu đã chọn
    $(".delete-all").on("click", function() {
        try {
            // Xem có bản ghi nào được chọn hay không
            var customer = document.querySelectorAll(".isSelected");
            if(customer.length > 0) {

                //Hiển thị form xác nhận xoá khách hàng
                $(".dialog-delete-customer").show();

                // Nếu không chấp nhận
                $(".dialog-delete-customer .cancel-delete").on("click", function() {
                    // Thoát form xác nhận xoá khách hàng
                    $(".dialog-delete-customer").hide();
                })

                // Nếu chấp nhận yêu cầu
                $(".accept-delete").on("click", function() {
                    // Gọi hàm loading
                    $(".m-loading").show();

                    // Đóng form xoá khách hàng
                    $(".dialog-delete-customer").hide();

                    // Gọi đến hàm delete all để xoá hết bản nghi được chọn:
                    selectedAll(".isSelected", deleteAll)

                    // Hiển thị toast xoá thành công sản phẩm và tự động ẩn
                    $(".delete-data").show();
                    setTimeout(() => {
                        $(".delete-data").hide();
                    }, 2000);

                    // Lấy ra tổng số lượng bản ghi
                    reLoadTotal("total");

                    // Reset lại số lượng bản ghi đã chọn
                    ReLoadQuantity(0);

                    // gọi function xoá icon-paging
                    removeIconPaging();
                })
            }
        }
        catch(error) {
            console.log(error);
        }
    });
    // Function xoá
    function deleteAll(item) {
        try {
            // Lấy ra customer đã lưu ở data mỗi tr
            var customer = $(item).data("customer");
            
            // Gọi api để xoá
            $.ajax({
                type: "DELETE",
                url: `https://cukcuk.manhnv.net/api/v1/Customers/${customer.CustomerId}`,
                dataType: "json",
                contentType: "application/json",
                success: function (response) {
                    // Sau khi xoá những dữ liệu được chọn thì hiển thị lại danh sách:

                    // Gọi hàm load lại dữ liệu
                    loadData();
                },
                error: function(response) {
                    implementerror(response);
                }
            });
        }
        catch(error) {
            console.log(error);
        }
    }

    
    

    // function hiển thị form chi tiết khách hang
    function showDetaiCustomer() {
        $(".show-customer").show();

        // Tự động focus vào ô mã khách hàng khi hiển thị form
        $("#customerCode").focus();
    }


    // function đóng form và làm mới lại dữ liệu trong form
    function HideDetaiCustomer() {
        $(".show-customer").hide();
        //  Xoá hết dữ liệu vừa nhập
        $("#customerCode").val("");
        $("#customerName").val("");
        $("#customerPhoneNumber").val("");
        $("#customerEmail").val("");
        $("#idCard").val("");
        $("#placeOfIssuance").val("");
        $("#loan").val("");
        $("#company").val("");
        $("#addressCompany").val("");
    }


    // function load dữ liệu lên table
    function loadData() {
        try {
        // Xoá hết dữ liệu trong tbody trước khi load dữ liệu lên
        $(".tbl-employee tbody").empty();

        // Lấy dữ liệu từ api
        $.ajax({
            type: "GET",
            url: "https://cukcuk.manhnv.net/api/v1/Customers",
            success: function (response) {
                for(let item of response) {

                    // Thay đổi cách hiển thị của ngày sinh
                    var dateofbirth = item.DateOfBirth;
                    if(dateofbirth) {
                        dateofbirth = new Date(dateofbirth);
                        var day = dateofbirth.getDate();
                        day = (day < 10) ? `0${day}` : day;
                        var month = dateofbirth.getMonth() + 1;
                        month = (month < 10) ? `0${month}` : month;
                        var year = dateofbirth.getFullYear();
                        
                        var date = `${day}/${month}/${year}`;
                    }

                    // Thay đổi cách hiển thị của giới tính
                    // 0: Nam, 1: Nữ, 3: Không xác định
                    var gender = (item.Gender == 0) ? "Nam" : (item.Gender == 1) ? "Nữ" : "Không xác định";


                    // Thay đổi cách hiển thị tiền nợ:
                    var debitamount = item.DebitAmount;
                    debitamount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(debitamount);
                    
                    var customer = $(`
                            <tr>
                                <td><input class="input-checkbox td" type="checkbox"></td>
                                <td>${item.CustomerCode}</td>
                                <td>${item.FullName}</td>
                                <td>${gender}</td>
                                <td style="text-align: center; padding-left: 0">${date}</td>
                                <td>${item.CompanyName}</td>
                                <td style="text-align:right; padding-right: 15px">${debitamount}</td>
                            </tr>
                    `);

                    // Gắn dữ liệu customer
                    customer.data("customer", item);

                    $("table tbody").append(customer);
                };

                // Kết thúc loading dữ liệu
                $(".m-loading").hide();

                //Hiển thị toast thông báo load dữ liệu thành công
                // $(".load-data-success").show();
                // setTimeout(() => {
                //     $(".load-data-success").fadeToggle(2000);
                // }, 2000);

                // Khai báo biến
                var quantitySelected = 10;

                // Load lại dữ liệu trong bản ghi khi thay đổi số lượng bản nghi trong select
                $(".m-dropdownlist-table").on("change", function() {
                    // Lấy ra giá trị được chọn trong ô option
                    quantitySelected = $(".m-dropdownlist-table").val();
                    
                    // Load lại số bản ghi 1 trang
                    loadRecord(quantitySelected, 1);

                    // gọi function xoá icon-paging
                    removeIconPaging();
                });

                // Phân trang

                // Lấy ra tất cả bản ghi
                let listRecords = document.querySelectorAll(".tbl-employee tbody tr");

                // Function load dữ liệu
                function loadRecord(limit, thisPage) {
                    // Điểm bắt đầu
                    let beginGet = (thisPage - 1) * limit;

                    // Điểm kết thúc
                    let endGet = thisPage * limit - 1;

                    // Duyệt vòng lặp foreach để hiển thị bản ghi
                    listRecords.forEach((item, key) => {
                        if(key >= beginGet && key <= endGet) {
                            $(item).show();
                        }
                        else {
                            $(item).hide();
                        }
                    });
                    
                    // Gọi fuction hiển thị số trang
                    listPage(limit, thisPage);
                }

                function listPage(limit, thisPage) {
                    // Tính số trang
                    let pages = Math.ceil(listRecords.length / limit);

                    //Làm mới lại pagination
                    $(".pagination").text("");

                    // Thêm element dịch trái
                    let after = document.createElement("p");
                    $(after).addClass('icon icon-after icon-paging');
                    $(".page-after").append(after);

                    // Thêm element dịch phải
                    let before = document.createElement("p");
                    $(before).addClass('icon icon-before icon-paging');
                    $(".page-before").append(before);

                    $(before).on("click", function() {
                        if(thisPage != pages) {
                            // gọi function xoá icon-paging
                            removeIconPaging();

                            changePage(limit, thisPage + 1);
                        }
                        else {
                            $(before).addClass('icon-paging-none');
                        }
                    })

                    $(after).on("click", function() {
                        if(thisPage != 1) {
                            // gọi function xoá icon-paging
                            removeIconPaging();

                            changePage(limit, thisPage - 1);
                        }
                    })

                    if(thisPage == 1) {
                        $(after).addClass('icon-paging-none');
                    }

                    if(thisPage == pages) {
                        $(before).addClass('icon-paging-none');
                    }

                
                    
                    
                    // Vòng lặp for để hiển thị số trang
                    for(let i = 1; i <= pages; i++) {
                        // Tạo 1 element rồi add vào pagination
                        let newPage = document.createElement("button");
                        newPage.innerText = i;
                        if(i == thisPage) {
                            newPage.style.background = "#50B83C";
                        }

                        // Thêm element vào pagination
                        $(".pagination").append(newPage);

                        // Khi click vào element sẽ hiển thị tương ứng
                        $(newPage).on("click", function() {
                            // gọi function xoá icon-paging
                            removeIconPaging();
                            
                            changePage(limit, i);
                        })
                    }
                }

                // Function đổi trang
                function changePage(limit, thisPage) {
                    loadRecord(limit, thisPage);
                }

                // Gọi function load record
                loadRecord(quantitySelected, 1);


                // Lấy ra tổng số lượng bản ghi
                reLoadTotal("total");


            
            },
            error: function(response) {
                implementerror(response);
            },
        });
    
        }
        catch(error) {
            console.log(error)
        }
    }

    // Function load lại tổng số lượng bản ghi
    function reLoadTotal(nameClass) {
        var list = document.querySelectorAll(".input-checkbox.td")
        $("."+nameClass).text(list.length);
    }

    // Function load lại số lượng bản ghi đã chọn
    function ReLoadQuantity(quantity) {
        $(".number-records").text(quantity);
        amount = quantity;
    }

    // Function giúp gọi hết tất cả thứ chọn trong table
    function selectedAll(place, nameForeachFunction) {
        var list = document.querySelectorAll(".tbl-employee"+" "+place);
        list.forEach(nameForeachFunction);
    }

    // Function xoá icon-paging trước đó
    function removeIconPaging() {
        try {
            let iconBefore = document.querySelector(".icon-before");
            iconBefore.remove();
            let iconAfter = document.querySelector(".icon-after");
            iconAfter.remove(); 
        }
        catch (error) {
            console.log(error);
        }
    }
});