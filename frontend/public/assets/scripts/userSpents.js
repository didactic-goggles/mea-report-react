let storage, storageRef;
let tableUserOrders;
let usersSpents = [];

window.addEventListener('DOMContentLoaded', async () => {
    await getUsersSpents();
})

const getUsersSpents = async () => {
    const getUsersFile = await fetch('../../../data/users/userSpents.json');
    usersSpents = await getUsersFile.json();
    initSpentMostTable();
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