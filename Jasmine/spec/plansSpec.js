describe('Plans', function() {
    describe('View', function() {
        describe('Page', function() {
            it('Page load', function() {
                expect(loading()).toBe('loading suceessful');
            })

        });
        describe('Put in', function() {
            it('Should validate arguments', function() {
                let newPutIn = document.createElement('div');
                expect(putIn('', document.getElementById('plane'))).toBe(null);
                expect(putIn(newPutIn)).toBe(null);
            });
        });
        describe('Create item', function() {
            it('Should create div 50x50', function() {
                let data = {
                    name: 'newTestDiv'
                },
                    style = {
                        width: '50px',
                        height: '50px'
                    },
                    newDiv = document.createElement('div');
                newDiv.id = data.name;
                newDiv.className = data.name;
                newDiv.style.width = style.width;
                newDiv.style.height = style.height;

                expect(createElement('div', data.name, {
                    className: data.name,
                    style: style
                })).toEqual(newDiv);
            });
            it('Should validate arguments', function() {
                let newDiv = document.createElement('div');
                newDiv.id = 'newDiv';
                document.getElementById('plane').appendChild(newDiv);
                expect(createElement('', 'newDiv2')).toBe(null);
                expect(createElement('div', '')).toBe(null);
                expect(createElement('div', 'newDiv')).toBe(null);
            });

        });
        describe('Create lines', function() {
            /*it('Should create main line', function() {
                let data = {
                    name: 'mainLine',
                    description: 'test description'
                },
                    outerMainLine = document.createElement('div');
                outerMainLine.id = 'outer-' + data.name;
                outerMainLine.className = data.name + ' main';
                outerMainLine.style.margin = styleLine.outerBlock.margin;
                let innerMainLine = document.createElement('div');
                innerMainLine.id = 'inner-' + data.name;
                innerMainLine.className = data.name + ' main';
                innerMainLine.style.margin = styleLine.innerBlock.margin;
                let descriptionMainLine = document.createElement('label');
                descriptionMainLine.id = 'description-' + data.name;
                descriptionMainLine.innerHTML = data.description;
                descriptionMainLine.className = data.name + ' main';
                descriptionMainLine.style.margin = styleLine.description.margin;

                innerMainLine.appendChild(descriptionMainLine);
                outerMainLine.appendChild(innerMainLine);

                expect(createMainLine(data)).toEqual(outerMainLine);
            });
            it('Should create sub line', function() {
                let data = {
                    name: 'subLine',
                    description: 'test description'
                },
                    innerSubLine = document.createElement('div');
                innerSubLine.id = 'inner-' + data.name;
                innerSubLine.className = data.name + ' sub';
                // innerSubLine.style.margin = styleLine.innerBlock.margin;
                let descriptionSubLine = document.createElement('label');
                descriptionSubLine.id = 'description-' + data.name;
                descriptionSubLine.innerHTML = data.description;
                descriptionSubLine.className = data.name + ' sub';
                // descriptionSubLine.style.margin = styleLine.description.margin;

                innerSubLine.appendChild(descriptionSubLine);

                expect(createSubLine(data)).toEqual(innerSubLine);
            });*/
            /*it('Should validate arguments', function() {
                let newLine = document.createElement('div');
                newLine.id = 'newLine';
                document.getElementById('plane').appendChild(newLine);
                expect(createMainLine({})).toBe(null);
                expect(createMainLine({
                    name: 'newLine'
                })).toBe(null);
                expect(createSubLine({})).toBe(null);
                expect(createSubLine({
                    name: 'newLine'
                })).toBe(null);
            })*/

        });
    });
    describe('Model', function() {
        describe('Saving', function() {
            let nodeSaving = new MainPoint('Node Saving', 'root'),
                nodeSaving1 = new MainPoint('Node Saving 1', 'Node Saving');
            it('Parse to JSON', function() {
                expect(parsingToJSON()).toBe(JSON.stringify(tree));
            });
            it('Upload to test server', function() {
                expect(save()).toBe(server);
            });
        });
        describe('Opening', function() {
            let nodeOpening = new MainPoint('Node Opening', 'root'),
                nodeOpening1 = new MainPoint('Node Opening 1', 'Node Opening'),
                testTree = Object.assign({}, tree),
                testServer = save(testTree),
                test = convertToNodes(parsingFromJSON(testServer));
            it('Parse from JSON', function() {
                expect(parsingFromJSON(testServer)).toEqual(JSON.parse(testServer));
            });
            it('Converting to nodes', function() {
                let nodeOpening2 = new MainPoint('Node Opening2', 'root'),
                    nodeOpening21 = new MainPoint('Node Opening2 1', 'Node Opening2'),
                    testTree2 = Object.assign({}, tree),
                    testServer2 = save(testTree),
                    test2 = convertToNodes(parsingFromJSON(testServer2));
                expect(test2).toEqual(testTree2);
            });
        });
        describe('Deleting', function() {
            let nodeDeleting = new MainPoint('Node deleting', 'root'),
                nodeDeleting1 = new MainPoint('Node deleting 1', 'Node deleting');
            it('Delete empty point', function() {
                nodeDeleting1.remove();
                expect(nodeDeleting.childrens()).toBe(null);
            })
            it('Delete point with childrens', function() {
                let nodeDeleting_21 = new MainPoint('Node deleting_2 1', 'root'),
                    nodeDeleting_21_1 = new MainPoint('Node deleting_2 1_1', 'Node deleting_2 1'),
                    nodeDeleting_21_2 = new MainPoint('Node deleting_2 1_2', 'Node deleting_2 1'),
                    nodeDeleting_22_1 = new MainPoint('Node deleting_2 2_1', 'Node deleting_2 1_1');
                nodeDeleting_21.remove();
                expect(findNode(nodeDeleting_21_2)).toBe(undefined);
                expect(findNode(nodeDeleting_21_2)).toBe(undefined);
                expect(findNode(nodeDeleting_22_1)).toBe(undefined);
            })

        });
        describe('Moving', function() {
            let nodeMoving = new MainPoint('Node Moving', 'root'),
                nodeMoving1 = new MainPoint('Node Moving 1', 'Node Moving'),
                nodeMoving2 = new MainPoint('Node Moving 2', 'Node Moving'),
                nodeMoving1_2 = new MainPoint('Node Moving 1_2', 'Node Moving 1');
            move('Node Moving 1_2', 'Node Moving 2');
            nodeMoving2Childs = nodeMoving2.childrens();
            nodeMoving1Childs = nodeMoving1.childrens();
            it('Move to another branch', function() {
                expect(nodeMoving2Childs).toEqual([nodeMoving1_2]);
                expect(nodeMoving1Childs).toBe(null);
            })
            it('Invalid property', function() {
                expect(move('Node Moving 1_2 foo', 'Node Moving 1')).toBe(null);
                expect(move('Node Moving 1_2', 'Node Moving 1 foo')).toBe(null);
            })
            it('Valid property', function() {
                expect(move('Node Moving 1_2', 'Node Moving 1')).toBe(nodeMoving1_2);
            })
            let nodeMoving3 = new MainPoint('Node Moving 3', 'Node Moving'),
                nodeMoving4 = new MainPoint('Node Moving 4', 'Node Moving'),
                nodeMoving4_1 = new MainPoint('Node Moving 4_1', 'Node Moving 4'),
                nodeMoving4_2 = new MainPoint('Node Moving 4_2', 'Node Moving 4'),
                nodeMoving5_1 = new MainPoint('Node Moving 5_1', 'Node Moving 4_1'),
                nodeMoving5_2 = new MainPoint('Node Moving 5_2', 'Node Moving 4_1'),
                nodeMoving6_1 = new MainPoint('Node Moving 6_1', 'Node Moving 5_1'),
                nodeMoving6_2 = new MainPoint('Node Moving 6_2', 'Node Moving 5_1');
            move('Node Moving 5_1', 'Node Moving 3');

            it('Deep move', function() {
                expect(findNode(getProperty(findNode(getProperty('Node Moving 6_2', 'parent')).name, 'parent'))).toBe(findNode('Node Moving 3'));
            })
        });
        describe('Get property', function() {
            let nodeGet = new MainPoint('Node Get', 'root'),
                nodeGet1 = new MainPoint('Node Get 1', 'Node Get'),
                nodeGet2 = new MainPoint('Node Get 2', 'Node Get');
            it('Get description', function() {
                setProperty('Node Get 2', 'description', 'This is Getd property');
                expect(getProperty('Node Get 2', 'description')).toBe('This is Getd property');
            });
            it('Get name', function() {
                expect(getProperty('Node Get 1', 'name')).toBe(nodeGet1.name);
                expect(getProperty('Node Get 1', 'name')).toBe('Node Get 1');
            });
            it('Invalid name', function() {
                expect(getProperty('Node Get 1 foo', 'description')).toBe(null);
            });
            it('Invalid property', function() {
                expect(getProperty('Node Get 1', 'price')).toBe(null);
                expect(getProperty('Node Get', 'Node Get 1')).toBe(null);
            });

        });
        describe('Change point', function() {
            let nodeChange = new MainPoint('Node Change', 'root'),
                nodeChange1 = new MainPoint('Node Change 1', 'Node Change'),
                nodeChange2 = new MainPoint('Node Change 2', 'Node Change');
            it('Change description', function() {
                setProperty('Node Change 2', 'description', 'This is changed property');
                expect(nodeChange2.description).toBe('This is changed property');
            });
            it('Change name', function() {
                setProperty('Node Change 1', 'name', 'Node Change 1 new');
                expect(nodeChange1.name).toBe('Node Change 1 new');
                expect(findNode('Node Change 1 new')).toBe(nodeChange1);
            });
            it('Invalid name', function() {
                expect(setProperty('Node Change 1 foo', 'description', 'This is changed property')).toBe(null);
            });
            it('Invalid property', function() {
                expect(setProperty('Node Change 1', 'price', 'This is changed property')).toBe(null);
                expect(setProperty('Node Change', 'Node Change 1', 'This is changed property')).toBe(null);
            });
            it('Invalid value', function() {
                expect(setProperty('Node Change 1', 'description', '')).toBe(null);
                expect(setProperty('Node Change 1', 'name', 'Node Change')).toBe(null);
            });

        });
        describe('Change proto', function() {
            let nodeParent = new MainPoint('Node parent', 'root'),
                nodeParent1 = new MainPoint('Node parent 1', 'Node parent'),
                nodeSubParent2 = new SubPoint('Node sub parent', 'Node parent 1');
            it('Change to main', function() {
                changeRole('Node sub parent', 'MainPoint');
                // nodeSubParent2.__proto__ = MainPoint.prototype;
                expect(nodeSubParent2.open).toBe(true);
            })
            it('Change to sub', function() {
                changeRole('Node sub parent', 'SubPoint');
                // nodeSubParent2.__proto__ = SubPoint.prototype;
                expect(nodeSubParent2.open).toBe(undefined);
            })

        });
        describe('Valid name', function() {
            let nodeValid = new MainPoint('Node valid', 'root');

            it('Node exists', function() {
                let nodeValidDoub = new MainPoint('Node valid', 'Node valid');
                expect(nodeValid.parent).toBe('root');
            })
            it('Empty name', function() {
                let nodeValidDoub = new MainPoint('', 'Node valid');
                expect(nodeValid.childrens()).toBe(null);
            })
            it('Empty parent', function() {
                let nodeEmptyParent = new MainPoint('nodeEmptyParent', '');
                expect(findNode('nodeEmptyParent')).toBe(undefined);
            })
            it('Parent dont exist', function() {
                let nodeWithoutParent = new MainPoint('nodeWithoutParent', 'foo');
                expect(findNode('nodeWithoutParent')).toBe(undefined);
            })
        });
        describe('Childrens', function() {
            let nodeChildrens = new MainPoint('Node childrens', 'root'),
                nodeChildrens1 = new MainPoint('Node childrens 1', 'Node childrens'),
                nodeChildrens2 = new MainPoint('Node childrens 2', 'Node childrens'),
                nodeChildrens1_1 = new MainPoint('Node childrens 1_1', 'Node childrens 1'),
                nodeChildrens1_2 = new MainPoint('Node childrens 1_2', 'Node childrens 1'),
                nodeChildrens1_2_1 = new MainPoint('Node childrens 1_2_1', 'Node childrens 1_2');

            it('Find 0 childrens', function() {
                expect(nodeChildrens2.childrens()).toBe(null);
            })
            it('Find 1 childrens', function() {
                expect(nodeChildrens1_2.childrens()).toEqual([nodeChildrens1_2_1]);
            })
            it('Find 2 childrens', function() {
                expect(nodeChildrens1.childrens()).toEqual([nodeChildrens1_1, nodeChildrens1_2]);
            })

        });
        describe('Points', function() {
            let parent = 'root',
                name = 'test',
                newPoint = new MainPoint(name, parent),
                parenteNode = findNode(parent);
            it('Main point created', function() {
                expect(newPoint.done).toBe(false);
                expect(newPoint.name).toBe(name);
                expect(newPoint.parent).toBe(parent);
                expect(parenteNode[name].name).toBe(name);
            })

            let parentSub = 'root',
                nameSub = 'test sub',
                newSubPoint = new SubPoint(nameSub, parentSub),
                parentSubNode = findNode(parentSub);
            it('Sub point created', function() {
                expect(newSubPoint.done).toBe(false);
                expect(newSubPoint.name).toBe(nameSub);
                expect(newSubPoint.parent).toBe(parentSub);
                expect(parentSubNode[nameSub].name).toBe(nameSub);
            })

            let node6 = {
                a: ''
            },
                newTree = {
                    node1: {
                        node2: {
                            node3: '',
                            node4: {
                                root: node6
                            }
                        }
                    }
                };
            it('Node finded', function() {
                expect(findNode('root', newTree)).toBe(node6);
            })

            let node1 = new MainPoint('node 1', 'root'),
                node1_1 = new MainPoint('node 1_1', 'node 1'),
                node1_2 = new MainPoint('node 1_2', 'node 1'),
                node1_3 = new MainPoint('node 1_3', 'node 1'),
                node2 = new MainPoint('node 2', 'root'),
                node2_1 = new MainPoint('node 2_1', 'node 2'),
                node2_2 = new MainPoint('node 2_2', 'node 2'),
                leaf1 = new SubPoint('leaf 1', 'node 1_3'),
                leaf2 = new SubPoint('leaf 2', 'node 2_2');
            it('BuildTree', function() {
                expect(findNode('leaf 1')).toBe(leaf1);
                expect(findNode('leaf 2')).toBe(leaf2);
            })
        })
        describe('Overview done', function() {
            let nodeDone1 = new MainPoint('node Done 1', 'root'),
                nodeDone1_1 = new MainPoint('node Done 1_1', 'node Done 1'),
                nodeDone1_2 = new MainPoint('node Done 1_2', 'node Done 1'),
                nodeDone1_3 = new MainPoint('node Done 1_3', 'node Done 1');
            it('Done parent', function() {
                nodeDone1_1.done = true;
                nodeDone1_2.done = true;
                nodeDone1_3.done = true;
                nodeDone1_3.overviewDone();
                expect(nodeDone1.done).toBe(true);
                expect(nodeDone1.overviewDoneChild()).toBe(true);
            })
            /*it('Done root', function() {
                nodeDone1_1.done = true;
                nodeDone1_2.done = true;
                nodeDone1_3.done = true;
                nodeDone1.overviewDone();
                expect(nodeDone1.done).toBe(true);
            })*/

            it('Undone parent', function() {
                nodeDone1_1.done = true;
                nodeDone1_2.done = false;
                nodeDone1_3.done = true;
                nodeDone1_2.overviewDone();
                expect(nodeDone1.done).toBe(false);
                expect(nodeDone1.overviewDoneChild()).toBe(false);
            })

            it('Repeat done parent', function() {
                nodeDone1_1.done = true;
                nodeDone1_2.done = true;
                nodeDone1_3.done = true;
                nodeDone1_3.overviewDone();
                expect(nodeDone1.done).toBe(true);
                expect(nodeDone1.overviewDoneChild()).toBe(true);
            })
            let nodeDoneDeep1 = new MainPoint('node Done Deep 1', 'root'),
                nodeDoneDeep2 = new MainPoint('node Done Deep 2', 'node Done Deep 1'),
                nodeDoneDeep3_1 = new MainPoint('node Done Deep 3_1', 'node Done Deep 2'),
                nodeDoneDeep3_2 = new MainPoint('node Done Deep 3_2', 'node Done Deep 2'), // done!
                nodeDoneDeep4_1 = new MainPoint('node Done Deep 4_1', 'node Done Deep 3_1'),
                nodeDoneDeep5_1 = new MainPoint('node Done Deep 5_1', 'node Done Deep 4_1'),
                nodeDoneDeep6_1 = new MainPoint('node Done Deep 6_1', 'node Done Deep 5_1'),
                nodeDoneDeep6_2 = new MainPoint('node Done Deep 6_2', 'node Done Deep 5_1');
            it('Deep done', function() {
                nodeDoneDeep6_1.done = true;
                nodeDoneDeep6_2.done = true;
                nodeDoneDeep3_2.done = true; // done!
                nodeDoneDeep6_1.overviewDone();
                expect(nodeDoneDeep1.done).toBe(true);
            })
            let nodeDoneDeep_21 = new MainPoint('node Done Deep_2 1', 'root'),
                nodeDoneDeep_22 = new MainPoint('node Done Deep_2 2', 'node Done Deep_2 1'),
                nodeDoneDeep_23_1 = new MainPoint('node Done Deep_2 3_1', 'node Done Deep_2 2'),
                nodeDoneDeep_23_2 = new MainPoint('node Done Deep_2 3_2', 'node Done Deep_2 2'), // not done!
                nodeDoneDeep_24_1 = new MainPoint('node Done Deep_2 4_1', 'node Done Deep_2 3_1'),
                nodeDoneDeep_25_1 = new MainPoint('node Done Deep_2 5_1', 'node Done Deep_2 4_1'),
                nodeDoneDeep_26_1 = new MainPoint('node Done Deep_2 6_1', 'node Done Deep_2 5_1'),
                nodeDoneDeep_26_2 = new MainPoint('node Done Deep_2 6_2', 'node Done Deep_2 5_1');
            it('Deep not done', function() {
                nodeDoneDeep_26_1.done = true;
                nodeDoneDeep_26_2.done = true;
                nodeDoneDeep_25_1.overviewDone();
                expect(nodeDoneDeep_21.done).toBe(false);
            })

        });
    })
})