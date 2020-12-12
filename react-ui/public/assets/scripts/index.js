let orders, users;
let storage, storageRef;
let tableUserOrders;
const usersSpents = [];
const servicesUsages = [];
window.addEventListener('DOMContentLoaded', async () => {
    storage = firebase.storage();
    storageRef = storage.ref();
    // await getOrders();
})

const getOrders = async () => {
    setLoading();
    try {
        const getFile = await fetch('../../../data/orders/sosyalbayiniz.net_panel_orders_28-11-2020.json');
        // var listRef = storageRef.child('orders/');
        // const getOrdersFiles = await listRef.listAll();
        // const url = await storageRef.child(getOrdersFiles.items[0]._delegate._location.path_).getDownloadURL();
        // const getFile = await fetch(url);
        orders = await getFile.json();
        initOrderTable();
        await getUsers();
    } catch (error) {
        console.log(error);
    }
    
    setLoading();
}


const getUsers = async () => {
    const getUsersFile = await fetch('../../../data/users/sosyalbayiniz.net_panel_users_28-11-2020.json');
    users = await getUsersFile.json();
    // var listRef = storageRef.child('users/');
    // const getUsersFiles = await listRef.listAll();
    // const url = await storageRef.child(getUsersFiles.items[0]._delegate._location.path_).getDownloadURL();
    // const getFile = await fetch(url);
    // users = await getFile.json();
    orders.forEach(order => {
        if(usersSpents[order.user]) {
            const updatedSpent = usersSpents[order.user].spent + Number(order.cost);
            usersSpents[order.user].spent = updatedSpent;
            usersSpents[order.user].quantity += 1;
            const isExistingServiceInUserSpendings = usersSpents[order.user].services.findIndex(service => service.id == order.service_id)
            if(isExistingServiceInUserSpendings != -1) {
                const updatedServiceSpent = usersSpents[order.user].services[isExistingServiceInUserSpendings].spent + Number(order.cost)
                usersSpents[order.user].services[isExistingServiceInUserSpendings].quantity += 1;
                usersSpents[order.user].services[isExistingServiceInUserSpendings].spent = updatedServiceSpent;
            } else {
                usersSpents[order.user].services.push({
                    id: order.service_id,
                    name: order.service_name,
                    quantity: 1,
                    spent: Number(order.cost)
                })
            }
        } else {
            usersSpents[order.user] = {
                user: order.user,
                spent: Number(order.cost),
                services: [{
                    id: order.service_id,
                    name: order.service_name,
                    quantity: 1,
                    spent: Number(order.cost)
                }],
                quantity: 1
            }
        }
        if(servicesUsages[order.service_id]) {
            servicesUsages[order.service_id].quantity += 1;
            servicesUsages[order.service_id].spent += Number(order.cost);
        } else {
            servicesUsages[order.service_id] = {
                id: order.service_id,
                name: order.service_name,
                spent: Number(order.cost),
                quantity: 1
            }
        }
    });
    initSpentMostTable();
    initServicesUsagesTable();
}


const initOrderTable = async () => {
    $('#tableOrders').DataTable( {
        data: orders,
        columns: [
            { 
                data: "id",
                title: 'Sipariş ID',
            },
            { 
                data: "user" ,
                title: 'Kullanıcı',
            },
            { 
                data: "charge",
                title: "Tutar"
            },
            { 
                data: "link", 
                title: 'Link',
                render: (data) => {
                    let wrappedLink = data;
                    if(data.startsWith('https://www.')) {
                        wrappedLink = data.split('https://www.')[1];
                    } else if(data.startsWith('https://')) {
                        wrappedLink = data.split('https://')[1];
                    }
                    return `<a href="${data}" class="short-text-250">${wrappedLink}</a>`
                }
            },
            { 
                data: "quantity",
                title: 'Adet',
            },
            { 
                data: "service_name",
                title: 'Servis'
            },
            { 
                data: "status",
                title: 'Durum'
            },
            { 
                data: "created",
                title: 'Tarih',
                render: (data) => {
                    return `<span>${moment(data).format('DD.MM.YYYY')}</span>`
                }
            },
            {
                responsivePriority: -1 ,
                targets: -1,
                title: "Actions",
                orderable: !1,
                render: function (t, a, l, e) {
                  return '\t\t\t\t\t\t\t<div class="dropdown dropdown-inline">\t\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" data-toggle="dropdown">\t                                <i class="la la-cog"></i>\t                            </a>\t\t\t\t\t\t\t  \t<div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\t\t\t\t\t\t\t\t\t<ul class="nav nav-hoverable flex-column">\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-edit"></i><span class="nav-text">Edit Details</span></a></li>\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-leaf"></i><span class="nav-text">Update Status</span></a></li>\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-print"></i><span class="nav-text">Print</span></a></li>\t\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t  \t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Edit details">\t\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\t\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                },
            }
        ],
        columnDefs: [
            { width: 40, targets: 0 },
            { width: 40, targets: 1 },
            { width: 40, targets: 2 }
        ],
        fixedColumns: true
    });
}

const initSpentMostTable = () => {
    const usersSpentsArray = [];
    Object.values(usersSpents).forEach(userSpents => usersSpentsArray.push(userSpents));
    const table = $('#tableSpentMost').DataTable( {
        data: usersSpentsArray,
        columns: [
            { 
                data: "user" ,
                title: 'Kullanıcı',
            },
            { 
                data: "spent",
                title: "Toplam Harcanan",
                render: data => `${data.round(2)}`
            },
            { 
                data: "quantity",
                title: "Toplam Sipariş"
            },
            { 
                data: "services", 
                title: 'En çok kul. servis',
                render: (data) => {
                    const mostUsedService = data.sort((s1,s2) => s1.quantity > s2.quantity ? -1 : 1)[0];
                    return `<span>${mostUsedService.name} (${mostUsedService.quantity})</span>`
                }
            },
            // { 
            //     data: "quantity",
            //     title: 'Adet',
            // },
            // { 
            //     data: "service_name",
            //     title: 'Servis'
            // },
            // { 
            //     data: "status",
            //     title: 'Durum'
            // },
            // { 
            //     data: "created",
            //     title: 'Tarih',
            //     render: (data) => {
            //         return `<span>${moment(data).format('DD.MM.YYYY')}</span>`
            //     }
            // },
            {
                responsivePriority: -1 ,
                targets: -1,
                title: "Actions",
                orderable: !1,
                render: function (t, a, l, e) {
                  return '\t\t\t\t\t\t\t<div class="dropdown dropdown-inline">\t\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" data-toggle="dropdown">\t                                <i class="la la-cog"></i>\t                            </a>\t\t\t\t\t\t\t  \t<div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\t\t\t\t\t\t\t\t\t<ul class="nav nav-hoverable flex-column">\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-edit"></i><span class="nav-text">Edit Details</span></a></li>\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-leaf"></i><span class="nav-text">Update Status</span></a></li>\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-print"></i><span class="nav-text">Print</span></a></li>\t\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t  \t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Edit details">\t\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\t\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                },
            }
        ],
        columnDefs: [
            { width: 40, targets: 0 },
            { width: 40, targets: 1 },
            { width: 40, targets: 2 }
        ],
        order: [[ 2, "desc" ]],
        fixedColumns: true
    });

    $('#tableSpentMost tbody').on( 'click', 'tr', function () {
        initUserOrdersTable(table.row(this).data());
    });
}

const initServicesUsagesTable = () => {
    const servicesUsagesArray = [];
    Object.values(servicesUsages).map(service => servicesUsagesArray.push(service));
    $('#tableUsedMost').DataTable( {
        data: servicesUsagesArray,
        columns: [
            { 
                data: "id" ,
                title: 'Servis ID',
            },
            { 
                data: "name" ,
                title: 'Servis Adı',
            },
            { 
                data: "spent",
                title: "Toplam Harcanan",
                render: data => `${data.round(2)}`
            },
            { 
                data: "quantity",
                title: "Toplam Sipariş"
            },
            {
                responsivePriority: -1 ,
                targets: -1,
                title: "Actions",
                orderable: !1,
                render: function (t, a, l, e) {
                  return '\t\t\t\t\t\t\t<div class="dropdown dropdown-inline">\t\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" data-toggle="dropdown">\t                                <i class="la la-cog"></i>\t                            </a>\t\t\t\t\t\t\t  \t<div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\t\t\t\t\t\t\t\t\t<ul class="nav nav-hoverable flex-column">\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-edit"></i><span class="nav-text">Edit Details</span></a></li>\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-leaf"></i><span class="nav-text">Update Status</span></a></li>\t\t\t\t\t\t\t    \t\t<li class="nav-item"><a class="nav-link" href="#"><i class="nav-icon la la-print"></i><span class="nav-text">Print</span></a></li>\t\t\t\t\t\t\t\t\t</ul>\t\t\t\t\t\t\t  \t</div>\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Edit details">\t\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t\t</a>\t\t\t\t\t\t\t<a href="javascript:;" class="btn btn-sm btn-clean btn-icon" title="Delete">\t\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t\t</a>\t\t\t\t\t\t';
                },
            }
        ],
        // columnDefs: [
        //     null,null,{ "sType": "numeric" },
        //     null,
        // ],
        order: [[ 3, "desc" ]],
        fixedColumns: true
    });
}

const initUserOrdersTable = (user) => {
    
    if(!document.querySelector('#userDetailsModal').getAttribute('table-initialized')) {
        document.querySelector('#userDetailsModal').setAttribute('table-initialized', true);
        tableUserOrders = $('#tableUserOrders').DataTable( {
            data: user.services,
            columns: [
                { 
                    data: "name" ,
                    title: 'Servis Adı',
                },
                { 
                    data: "spent",
                    title: "Toplam Harcanan",
                    render: data => `${data.round(2)}`
                },
                { 
                    data: "quantity",
                    title: "Toplam Sipariş"
                }
            ],
            // columnDefs: [
            //     { width: 40, targets: 0 },
            //     { width: 40, targets: 1,"sType": "numeric", },
            //     { width: 40, targets: 2 }
            // ],
            order: [[ 2, "desc" ]],
            fixedColumns: true
        });
    } else {
        tableUserOrders.clear().draw();
        tableUserOrders.rows.add(user.services); // Add new data
        tableUserOrders.columns.adjust().draw(); 
    }
    initUsersOrdersMostUsedServicesChart(user);
    initUsersOrdersMostSpentServicesChart(user);
    $('#userDetailsModal').modal('show');
    document.querySelector('#userDetailsModal .modal-title').innerHTML = user.user;
}

const initUsersOrdersMostUsedServicesChart = user => {
    const chartDataArray = user.services.sort((service1, service2) => service1.quantity < service2.quantity ? 1 : -1);

    var options = {
        series: chartDataArray.slice(0,5).map(service => service.quantity),
        chart: {
        width: '100%',
        type: 'donut',
      },
      title: {
        text: 'En çok kullandığı servisler'
      },
      labels: chartDataArray.slice(0,5).map(service => service.name),
      dataLabels: {
        enabled: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
            height: 350
          },
          legend: {
            show: false
          }
        }
      }],
      legend: {
        show: false,
        // position: 'right',
        // offsetY: 0,
        // height: 230,
      }
      };

      var chart = new ApexCharts(document.querySelector("#chartUserOrdersMostUsedServices"), options);
      chart.render();
}

const initUsersOrdersMostSpentServicesChart = user => {
    console.log(user);
    const chartDataArray = user.services.sort((service1, service2) => service1.spent < service2.spent ? 1 : -1);
    
    var options = {
        series: chartDataArray.slice(0,5).map(service => service.spent),
        chart: {
        width: '100%',
        type: 'donut',
      },
      title: {
        text: 'En çok harcadığı servisler'
      },
      labels: chartDataArray.slice(0,5).map(service => service.name),
      dataLabels: {
        enabled: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
            height: 250
          },
          legend: {
            show: false
          }
        }
      }],
      legend: {
          show: false,
        // position: 'right',
        // offsetY: 0,
        // height: 230,
      }
      };

      var chart = new ApexCharts(document.querySelector("#chartUserOrdersMostSpentServices"), options);
      chart.render();
}

const setLoading = () => $('#loadingModal').modal($('#loadingModal').hasClass('show') ? 'hide' : 'show');


Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
};