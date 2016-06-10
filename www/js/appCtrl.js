angular.module('appCtrl', ['ionic', 'appCtrl.controllers', 'appCtrl.services'])
    .run(function($ionicPlatform, $location, $ionicHistory, $rootScope, $window, Logger) {
        $ionicPlatform.ready(function() {
            document.addEventListener('deviceready', function() {
                if (navigator.battery) {
                    $window.addEventListener('batterystatus', function(result) {
                        Logger.add('status:' + JSON.stringify(result));
                    }, false);
                    $window.addEventListener('batterycritical', function(result) {
                        Logger.add('critical:' + JSON.stringify(result));
                    }, false);
                    $window.addEventListener('batterylow', function(result) {
                        Logger.add('low:' + JSON.stringify(result));
                    }, false);
                }
            }, false);

            // navigator.splashscreen.hide();
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }
        });
        $ionicPlatform.registerBackButtonAction(function(e) {
            e.preventDefault();
            if ($location.path() == '/tab/flashlight') {
                window.plugins.flashlight.available(function(isAvailable) {
                    if (isAvailable) {
                        window.plugins.flashlight.switchOff();
                        $rootScope.imgUrl = 'img/off.png';
                    } else {
                        alert('Flashlight not available on this device.');
                    }
                });
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }
            } else if ($location.path() == '/tab/bluetooth') {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                }
            } else {
                ionic.Platform.exitApp();
            }
            return false;
        }, 100);
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab', {
                url: '/tab',
                // abstract: true 表明此状态不能被显性激活，只能被子状态隐性激活
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tab.central', {
                url: '/central',
                views: {
                    'tab-central': {
                        templateUrl: 'templates/central.html',
                        controller: 'CentralCtrl'
                    }
                }
            })
            .state('tab.setting', {
                url: '/setting',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/setting.html',
                        controller: 'SettingCtrl'
                    }
                }
            })
            .state('tab.about', {
                url: '/about',
                views: {
                    'tab-about': {
                        templateUrl: 'templates/about.html',
                        controller: 'AboutCtrl'
                    }
                }
            })
            .state('tab.log', {
                url: '/log',
                views: {
                    'tab-log': {
                        templateUrl: 'templates/log.html',
                        controller: 'LogCtrl'
                    }
                }
            })
            .state('tab.bluetooth', {
                url: '/bluetooth',
                views: {
                    'tab-central': {
                        templateUrl: 'templates/bluetooth.html',
                        controller: 'BluetoothCtrl'
                    }
                }
            })
            .state('tab.flashlight', {
                url: '/flashlight',
                views: {
                    'tab-central': {
                        templateUrl: 'templates/flashlight.html',
                        controller: 'FlashlightCtrl'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/central');
    })
    .config(function($ionicConfigProvider) {
        // android 平台默认 tab 是在顶部，需要手动设置到底部
        // $ionicConfigProvider.platform.ios.tabs.style('standard');
        // $ionicConfigProvider.platform.ios.tabs.position('bottom');
        // $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        // $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        // $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
        $ionicConfigProvider.platform.android.views.transition('android');
    });
