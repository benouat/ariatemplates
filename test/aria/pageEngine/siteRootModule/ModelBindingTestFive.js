/**
 * Test a simple binding with two modules
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.siteRootModule.ModelBindingTestFive",
    $extends : "test.aria.pageEngine.siteRootModule.SiteRootModuleBaseTestCase",
    $prototype : {
        testAsyncMultipleBinding : function () {
            this._createSiteModule({
                appData : {
                    second : false,
                    baseFacts : {
                        one : 1,
                        two : 2
                    }
                },
                cb : {
                    fn : this._loadSubmodules,
                    scope : this
                }
            });

        },

        _loadSubmodules : function (res) {
            var moduleConf = {
                page : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule1",
                            initArgs : {
                                first : false
                            },
                            bind : {
                                "first" : "appData:baseFacts.first",
                                "second" : "appData:second"
                            }
                        }, {
                            refpath : "m2.m3",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule3",
                            bind : {
                                "first.third" : "appData:baseFacts.first",
                                "second.fourth" : "appData:second"
                            }
                        }],
                common : [{
                            refpath : "m1",
                            classpath : "test.aria.pageEngine.testContents.modules.BoundModule2",
                            bind : {
                                "first.data" : "appData:baseFacts.first",
                                "second" : "appData:second"
                            }
                        }]
            };

            this.rm.loadModules(this.pageId, moduleConf, {
                fn : this._checkBindings,
                scope : this
            });
        },

        _checkBindings : function () {
            // change a bound value
            this.$json.setValue(this._getModuleData("m1", true), "first", "new");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new");
            this.assertEquals(this._getModuleData("common:m1", false).first.data, "new");
            this.assertEquals(this._getModuleData("m2.m3", false).first.third, "new");

            // change a value directly in the app data
            this.$json.setValue(this.rm.getData().storage.appData, "second", true);
            this.assertEquals(this._getModuleData("m1", false).second, true);
            this.assertEquals(this._getModuleData("common:m1", false).second, true);
            this.assertEquals(this._getModuleData("m2.m3", false).second.fourth, true);

            this._removeOneModuleBinding();

        },

        _removeOneModuleBinding : function () {
            this.rm.disconnectBindings([this.rm.buildModuleRefpath("m1", false, this.pageId)]);

            this.$json.setValue(this._getModuleData("m1", true), "first", "old");
            this.assertEquals(this._getModuleData("m1", false).first, "old");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new");
            this.assertEquals(this._getModuleData("common:m1", false).first.data, "new");
            this.assertEquals(this._getModuleData("m2.m3", false).first.third, "new");

            this.$json.setValue(this.rm.getData().storage.appData, "second", "a string");
            this.assertEquals(this._getModuleData("m1", false).second, true);
            this.assertEquals(this._getModuleData("common:m1", false).second, "a string");
            this.assertEquals(this._getModuleData("m2.m3", false).second.fourth, "a string");

            this._removeAllModulesBinding();
        },

        _removeAllModulesBinding : function () {
            this.rm.disconnectBindings();

            this.$json.setValue(this._getModuleData("m2.m3", true).first, "third", "another");
            this.$json.setValue(this._getModuleData("common:m1", true).first, "data", "yet another");
            this.assertEquals(this._getModuleData("m1", false).first, "old");
            this.assertEquals(this.rm.getData().storage.appData.baseFacts.first, "new");
            this.assertEquals(this._getModuleData("common:m1", false).first.data, "yet another");
            this.assertEquals(this._getModuleData("m2.m3", false).first.third, "another");

            this.$json.setValue(this.rm.getData().storage.appData, "second", "another string");
            this.assertEquals(this._getModuleData("m1", false).second, true);
            this.assertEquals(this._getModuleData("common:m1", false).second, "a string");
            this.assertEquals(this._getModuleData("m2.m3", false).second.fourth, "a string");

            this.completeTest();
        }

    }
});
