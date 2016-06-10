angular.module('appCtrl.controllers', [])
    .controller('CentralCtrl', ['$scope', '$state', 'Logger', function($scope, $state, Logger) {
        $scope.goBluetooth = function() {
            $state.go('tab.bluetooth');
            Logger.add('跳转到蓝牙测试页');
        };
        $scope.goFlashlight = function() {
            $state.go('tab.flashlight');
            Logger.add('跳转到手电筒测试页');
        };
    }])
    .controller('SettingCtrl', ['$scope', function($scope) {}])
    .controller('AboutCtrl', ['$scope', function($scope) {}])
    .controller('BluetoothCtrl', ['$scope', 'Logger', '$ionicTabsDelegate', '$timeout', function($scope, Logger, $ionicTabsDelegate, $timeout) {
        $scope.devices = [];
        $scope.bles = {};
        // 初始化
        $scope.initialize = function() {
            bluetoothle.initialize(function(data) {
                Logger.add('初始化成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('初始化出错' + JSON.stringify(error));
            }, {
                request: true
            });
        };
        // 开启蓝牙
        $scope.enable = function() {
            bluetoothle.enable(function(data) {
                Logger.add('蓝牙开启成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('蓝牙开启出错' + JSON.stringify(error));
            });
        };
        // 关闭蓝牙
        $scope.disable = function() {
            bluetoothle.disable(function(data) {
                Logger.add('蓝牙关闭成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('蓝牙关闭出错' + JSON.stringify(error));
            });
        };
        // 开始扫描
        $scope.startScan = function() {
            bluetoothle.startScan(function(result) {
                if (result.status == 'scanStarted') {
                    var timer = $timeout(function() {
                        bluetoothle.stopScan(function(e) {
                            $scope.$apply(function() {
                                Logger.add('停止扫描成功' + JSON.stringify(e));
                            });
                        }, function(error) {
                            Logger.add('停止扫描出错' + JSON.stringify(error));
                        });
                    }, 3000);
                    Logger.add('开始扫描成功' + JSON.stringify(result));
                    $scope.$on('$destroy', function(e) {
                        $timeout.cancel(timer);
                    });
                    return;
                }
                if ($scope.bles[result.address] == true) {
                    return;
                }
                $scope.$apply(function() {
                    $scope.devices.push(result);
                    Logger.add('扫描到设备' + JSON.stringify(result));
                });
                $scope.bles[result.address] = true;
            }, function(error) {
                Logger.add('开始扫描出错' + JSON.stringify(error));
            }, {
                services: [],
                scanMode: bluetoothle.SCAN_MODE_LOW_LATENCY,
                matchMode: bluetoothle.MATCH_MODE_AGGRESSIVE,
                matchNum: bluetoothle.MATCH_NUM_MAX_ADVERTISEMENT,
                callbackType: bluetoothle.CALLBACK_TYPE_ALL_MATCHES //必须用这个模式，如果用 CALLBACK_TYPE_FIRST_MATCH 这个模式在装有 API21 的 Nexus 7 上不支持
            });
        };
        // 恢复连接
        $scope.retrieveConnected = function() {
            bluetoothle.retrieveConnected(function(data) {
                Logger.add('恢复连接成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('恢复连接出错' + JSON.stringify(error));
            }, {
                services: []
            });
        };
        // 连接到蓝牙设备
        $scope.connect = function(address) {
            bluetoothle.connect(function(data) {
                $scope.currentAddress = address;
                Logger.add('连接成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('连接出错' + JSON.stringify(error));
            }, {
                address: address,
                timeout: 1000
            });
        };
        // 重新连接到某一个设备
        $scope.reconnect = function() {
            bluetoothle.reconnect(function(data) {
                Logger.add('重新连接成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('重新连接出错' + JSON.stringify(error));
            }, { address: $scope.currentAddress });
        };
        // 断开到某个设备的连接
        $scope.disconnect = function() {
            bluetoothle.disconnect(function(data) {
                Logger.add('断开连接成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('断开连接出错' + JSON.stringify(error));
            }, { address: $scope.currentAddress });
        };
        // 关闭 ble 设备
        $scope.close = function() {
            bluetoothle.close(function(data) {
                Logger.add('关闭ble成功' + JSON.stringify(data));
            }, function(error) {
                Logger.add('关闭ble出错' + JSON.stringify(error));
            }, { address: $scope.currentAddress });
        };
        // 发现设备
        $scope.discover = function() {
            bluetoothle.discover(function(data) {
                Logger.add('启动发现设备' + JSON.stringify(data));
            }, function(error) {
                Logger.add('发现设备出错' + JSON.stringify(error));
            }, { address: $scope.currentAddress });
        };
    }])
    .controller('FlashlightCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.imgUrl = 'img/off.png';
        $scope.clickImage = function() {
            window.plugins.flashlight.available(function(isAvailable) {
                if (isAvailable) {
                    window.plugins.flashlight.toggle();
                } else {
                    alert("Flashlight not available on this device");
                }
            });
            if ($rootScope.imgUrl.indexOf('on.png') >= 0) {
                $rootScope.imgUrl = 'img/off.png';
            } else {
                $rootScope.imgUrl = 'img/on.png';
            }
        };
    }])
    .controller('LogCtrl', ['$scope', '$rootScope', 'Logger', function($scope, $rootScope, Logger) {
        $scope.clear = function() {
            Logger.clear();
        };
    }]);
