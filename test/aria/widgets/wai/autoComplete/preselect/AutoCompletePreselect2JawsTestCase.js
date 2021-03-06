/*
 * Copyright 2016 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.autoComplete.preselect.AutoCompletePreselect2JawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.autoComplete.preselect.AutoCompleteTpl"
        });
        this.noiseRegExps.push(/type in text/i, /^i$/i);
    },
    $prototype : {
        runTemplateTest : function () {
            this.synEvent.execute([
                ["click", this.getInputField("country")], ["pause", 1000],
                ["type", null, "+"], ["pause", 5000],
                ["type", null, "3"], ["pause", 5000],
                ["type", null, "[<shift>][home][>shift<]"], ["pause", 1000],
                ["type", null, "i"], ["pause", 5000],
                ["type", null, "s"], ["pause", 5000],
                ["type", null, "[enter]"], ["pause", 3000]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(                    [
                        "Country Edit",
                        "List view Austria +43 1 of 4",
                        "There are 3 other suggestions, use up and down arrow keys to navigate and enter to validate.",
                        "List view France +33 1 of 1",
                        "There is no other suggestion. Press enter to accept it or change your entry.",
                        "List view Israel +972 1 of 1",
                        "There is no other suggestion. Press enter to accept it or change your entry.",
                        "List view Israel +972 1 of 1",
                        "There is no other suggestion. Press enter to accept it or change your entry.",
                        "Country Edit",
                        "Israel +972"
                    ].join("\n"), this.end);
                },
                scope: this
            });
        }
    }
});
