//
//
//			Models
//
//

let newNodeParent,
    plane = document.getElementById('plane'),
    dragObject = {},
    styleLine = {

    },
    Base = function() {
        // объект базы
        // 

        this.tree = {
            root: {
                name: 'root',
                description: 'Задачи',
                type: 'root'
            }
        };
        this.undoArr = [];
        this.redoArr = [];
        // отправка данных на сервер.
        this.sendAjax = (data) => {
            $.post(
                'send.php', {
                    submit: data
                },
                function(resp) {
                    console.log('Save successful', resp);
                }
            )
        };
        this.sendFetch = (data) => {
            fetch('send.php', {
                method: "POST",
                body: data,
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                mode: 'cors'
            })
                .then(res => {
                    res.text().then(text => {
                        console.log('Save successful', text);
                    })

                });
        };

        // получение данных с сервера.
        this.updateAjax = (parse, convert) => {
            let that = this;
            $.post(
                'update.php', '',
                function(data) {
                    that.tree = convert(parse(data));
                    drawing.drawList();
                }
            )
        };
        // получение данных с сервера.
        this.updateFetch = (parse, convert) => {
            let that = this;
            fetch('update.php', {
                mode: 'cors',
                headers: {
                    'content-type': 'application/json;charset=UTF-8'
                }
            })
                .then(res => {
                    res.json().then(data => {
                        that.tree = convert(data);
                        drawing.drawList();
                    });
                })

        };

        this.undo = () => {
            this.redoArr.push(this.parsingToJSON());
            this.tree = this.convertToNodes(this.parsingFromJSON(this.undoArr.splice(this.undoArr.length - 1, 1)[0]));
        };
        this.redo = () => {
            this.undoArr.push(this.parsingToJSON());
            this.tree = this.convertToNodes(this.parsingFromJSON(this.redoArr.splice(this.redoArr.length - 1, 1)[0]));
        };


        // работа с базой 
        this.getProperty = (name, property) => {
            let node = base.findNode(name);
            if (!node || node[property] === undefined || typeof node[property] === 'object') {
                console.error('Invalid arguments');
                return null;
            }
            return node[property];
        }

        this.setProperty = (name, property, value) => {
            let node = base.findNode(name);
            if (!node || typeof node[property] === 'object' || node[property] === undefined || value === '') {
                console.error('Invalid arguments');
                return null;
            }
            // не забываем менять запись у родителя
            if (property === 'name') {
                if (base.findNode(value)) return null;
                let parent = base.findNode(node.parent),
                    previousName = node.name;
                parent[value] = node;
                delete parent[previousName];
                for (let item in node) {
                    if (typeof node[item] !== 'object') continue;
                    node[item].parent = value;
                }
            }
            node[property] = value;
            return node[property];
        }

        this.move = (point, to) => {
            let node = base.findNode(point),
                parentNode = node ? base.findNode(node.parent) : {},
                toNode = base.findNode(to);
            if (!node || !toNode || parentNode === toNode) return null;
            node.parent = to;
            if (toNode instanceof SubPoint) changeRole(to, 'MainPoint');
            toNode[point] = node;
            delete parentNode[point];
            return node;
        }
        this.save = (data = this.tree, upload = this.uploadTest, parse = this.parsingToJSON) => {
            return upload(parse(data));
        }

        this.parsingToJSON = (data = this.tree) => {
            return JSON.stringify(data).replace(/"/g, '\"');
        }
        this.open = (download = this.downloadTest) => {
            let data = download();
        }

        this.convertToNodes = (data = this.tree) => {
            for (item in data) {
                if (typeof data[item] === 'object') this.convertToNodes(data[item]);
            }
            if (data === this.tree) return data;
            if (data.type === 'MainPoint') data.__proto__ = MainPoint.prototype;
            else if (data.type === 'SubPoint') data.__proto__ = SubPoint.prototype;
            return data;
        }

        this.downloadServer = (parse = this.parsingFromJSON, convert = this.convertToNodes, update = this.updateFetch) => {
            return update(parse, convert);
        }

        this.downloadTest = (parse = this.parsingFromJSON, convert = this.convertToNodes) => {
            let nodeDraw = new MainPoint('Node_Draw', 'root', 'Разработать TODO-лист'),
                nodeDraw2 = new MainPoint('Node_Draw_2', 'Node_Draw', 'Создать надёжную расширяемую модель'),
                nodeDraw1 = new MainPoint('Node_Draw_1', 'Node_Draw', 'Создать интерфейс (отображение)'),
                nodeDraw1_2 = new MainPoint('Node_Draw_1_2', 'Node_Draw_1', 'Реализовать блоковое построение списка'),
                nodeDrawLeaf1 = new SubPoint('Node_Draw_leaf1', 'Node_Draw_1_2', 'Сделать создание листовых задач'),
                nodeDrawLeaf2 = new SubPoint('Node_Draw_leaf2', 'Node_Draw_1_2', 'Сделать создание узловых задач'),
                nodeDraw3 = new MainPoint('Node_Draw_3', 'Node_Draw', 'Покрыть тестами'),
                nodeDraw4 = new MainPoint('Node_Draw_4', 'Node_Draw', 'Создать интерфейс (редактирование)'),
                nodeDraw4_1 = new SubPoint('Node_Draw_4_1', 'Node_Draw_4', 'Реализовать удаление'),
                nodeDraw4_2 = new MainPoint('Node_Draw_4_2', 'Node_Draw_4', 'Реализовать редактирование'),
                nodeDraw5_1 = new MainPoint('Node_Draw_5_1', 'Node_Draw_4_2', 'Реализовать создание'),
                nodeDraw5_2 = new MainPoint('Node_Draw_5_2', 'Node_Draw_4_2', 'Реализовать изменение описания'),
                nodeDraw6_1 = new MainPoint('Node_Draw_6_1', 'Node_Draw_4_2', 'Реализовать изменение структуры');
            drawing.drawList();

        }

        this.parsingFromJSON = (data) => {
            return JSON.parse(data);
        }

        this.uploadServer = (data, send = base.sendFetch) => {
            send(data);
            return data;
        }

        this.uploadTest = (data) => {
            //
        }

        this.overviewDoneTree = (node = this.tree) => {
            this.done = true;
            for (let item in this) {
                if (typeof this[item] !== 'object') continue;
                else this[item].done = this.overviewDoneTree(this[item]);

                if (!this[item].done) {
                    this.done = false;
                }
            }
            return this.done;
        }

        this.findNode = (name, obj = this.tree) => {
            if (obj[name]) return obj[name];
            for (let item in obj) {
                if (typeof obj[item] !== 'object') continue;
                let res = this.findNode(name, obj[item]);
                if (res) return res;
            }
        }

        this.buildList = (data = this.tree.root) => {
            let mainPoint = drawing.createLine(data);
            for (let item in data) {
                if (data[item] instanceof MainPoint) drawing.putIn(this.buildList(data[item]), mainPoint);
                else if (data[item] instanceof SubPoint) drawing.putIn(drawing.createLine(data[item]), mainPoint);
            }
            return mainPoint;
        }
    },
    base = new Base();

function Point() {
    this.name = '';
    this.description = '';
    this.type = '';
    this.parent = '';
    this.done = false;
}
Point.prototype.constructor = Point;
Point.prototype.remove = function() {
    let parentNode = base.findNode(this.parent);
    delete parentNode[this.name];
}
Point.prototype.overviewDoneChild = function() {
    for (let item in this) {
        if (typeof this[item] !== 'object') continue;
        if (!this[item].done) return false;
    }
    return true;
}
Point.prototype.overviewDone = function() {
    let parent = base.findNode(this.parent);
    for (let item in parent) {
        if (typeof parent[item] !== 'object') continue;
        if (!parent[item].done) {
            parent.done = false;
            if (parent instanceof MainPoint) parent.overviewDone();
            return;
        }
    }
    parent.done = true;
    if (parent instanceof MainPoint) parent.overviewDone();
}

function MainPoint(name, parent, description = '') {
    if (base.findNode(name) || name === '' || parent === '' || !base.findNode(parent)) {
        console.error('Invalid arguments');
        return;
    }
    this.name = name;
    this.description = description;
    this.parent = parent;
    this.type = 'MainPoint';
    // записываем в дерево пункт
    let parentNode = base.findNode(parent);
    parentNode[name] = this;
}
MainPoint.prototype = new Point();
MainPoint.prototype.constructor = MainPoint;
MainPoint.prototype.countChildren = 0;
MainPoint.prototype.open = true;
MainPoint.prototype.childrens = function() {
    let result = [];
    for (item in this)
        if (this[item] instanceof MainPoint) result.push(this[item]);
    return result.length ? result : null;
};


function SubPoint(name, parent, description = '') {
    if (base.findNode(name) || name === '' || parent === '' || !base.findNode(parent)) {
        console.error('Invalid arguments');
        return;
    }
    if (base.findNode(parent) instanceof SubPoint) {
        changeRole(parent, 'MainPoint')
    }
    this.name = name;
    this.description = description;
    this.parent = parent;
    this.type = 'SubPoint';
    // записываем в дерево пункт
    let parentNode = base.findNode(parent);
    parentNode[name] = this;
}
SubPoint.prototype = new Point();
SubPoint.prototype.constructor = SubPoint;

function changeRole(name, newType) {
    let node = base.findNode(name);
    if (!node || (newType !== 'MainPoint' && newType !== 'SubPoint') || node.type === newType) {
        console.error('Invalid arguments');
        return null;
    }
    node.type = newType;
    if (newType === 'MainPoint') node.__proto__ = MainPoint.prototype;
    else node.__proto__ = SubPoint.prototype;
    return node;
}



function idFunc(str) {
    return str.split('').map(item => item.charCodeAt(0)).join('');
}

//
//
//			Views
//
//
let Drawing = function() {
    this.createElement = (type, id, parameters) => {
        if (!type || !id || !! document.getElementById(id)) {
            console.error('Invalid arguments');
            return null;
        }
        let element = document.createElement(type);
        element.id = id;
        for (item in parameters) {
            if (typeof parameters[item] === 'object') {
                element[item] = {};
                for (itemIns in parameters[item]) {
                    element[item][itemIns] = parameters[item][itemIns];
                }
            } else element[item] = parameters[item]
        }
        return element;
    }

    this.createLine = (data, style = styleLine, createFunc = this.createElement) => {
        if (!data || !data.name || !! document.getElementById(data.name)) {
            console.error('Invalid arguments');
            return null;
        }
        let type = data.type;
        let outerBlock = createFunc('div', 'outer-of-' + data.name, {
            className: data.name + ' ' + type + ' outer',
            style: style.outerBlock
        }),
            innerBlock = createFunc('div', 'inner-of-' + data.name, {
                className: data.name + ' ' + type + ' inner ',
                style: style.innerBlock
            }),
            moveBlock = createFunc('div', 'moveBlock-of-' + data.name, {
                className: data.name + ' move draggable inner ' + type,
                innerHTML: '☰',
                style: style.innerBlock
            }),
            checkboxBlock = createFunc('label', 'checkboxBlock-of-' + data.name, {
                className: data.name + ' ' + type + ' custom-control custom-checkbox',
                style: style.innerBlock
            }),
            textCheckboxBlock = createFunc('div', 'textCheckboxBlock-' + data.name, {
                className: data.name + ' ' + type + ' textCheckboxBlock  custom-control-label',
                innerHTML: '',
                style: style.innerBlock
            }),
            checkbox = createFunc('input', 'checkbox-of-' + data.name, {
                disabled: data.type === 'MainPoint' ? (base.findNode(data.name).overviewDoneChild() ? '' : 'disable') : '',
                type: 'checkbox',
                checked: data.done ? 'checked' : '',
                className: data.name + ' line-checkbox ' + type + ' custom-control-input',
            }),
            description = createFunc('div', 'description-' + data.name, {
                className: data.name + ' ' + type + ' description ',
                style: style.description
            }),
            descriptionText = createFunc('span', 'descriptionText-of-' + data.name, {
                className: data.name + ' ' + type + ' descriptionText droppable',
                innerHTML: data.description || '',
                style: style.description
            }),
            descriptionInput = createFunc('input', 'descriptionInput-of-' + data.name, {
                className: data.name + ' ' + type + ' descriptionInput' + (data.done ? ' done' : ''),
                type: 'text',
                value: data.description || '',
                style: {
                    width: data.description.length * 11
                }
            }),
            plus = createFunc('span', 'plus-of-' + data.name, {
                className: data.name + ' plus ',
                innerHTML: '+'
            }),
            remove = createFunc('span', 'remove-of-' + data.name, {
                className: data.name + ' remove',
                innerHTML: '&times;'
            });
        if (type === 'root') {
            let description = createFunc('div', 'description-' + data.name, {
                className: data.name + ' description droppable',
                innerHTML: data.description,
                style: style.description
            });
            this.putIn(plus, description);
            this.putIn(description, innerBlock);
            return this.putIn(innerBlock, outerBlock);
        }
        this.putIn(checkbox, checkboxBlock);
        this.putIn(textCheckboxBlock, checkboxBlock);
        this.putIn(moveBlock, innerBlock);
        this.putIn(checkboxBlock, innerBlock);
        this.putIn(descriptionInput, description);
        this.putIn(descriptionText, description);
        this.putIn(plus, description);
        this.putIn(remove, description);
        this.putIn(description, innerBlock);
        return type === 'MainPoint' ? this.putIn(innerBlock, outerBlock) : innerBlock;
    }

    this.putIn = (element, box) => {
        if (!element || !box) {
            console.error('Invalid arguments');
            return null;
        }
        box.appendChild(element);
        return box;
    }


    this.drawList = () => {
        document.getElementsByClassName('undo')[0].className = 'undo ' + (base.undoArr.length ? 'active' : 'mute');
        document.getElementsByClassName('redo')[0].className = 'redo ' + (base.redoArr.length ? 'active' : 'mute');
        plane = document.getElementById('plane');
        plane.innerHTML = '';
        this.putIn(base.buildList(), plane);
        base.save();
    }
},
    drawing = new Drawing();


//
//
//			Controllers
//
//

window.addEventListener('load', () => {
    base.open();
});

plane.onclick = function(event) {
    let node = base.findNode(event.target.id.split('-of-')[1]);
    if (~event.target.className.indexOf('line-checkbox')) {
        base.undoArr.push(base.parsingToJSON());
        node.done = !node.done;
        node.overviewDone();
        drawing.drawList();
    } else if (~event.target.className.indexOf('remove')) {
        base.undoArr.push(base.parsingToJSON());
        node.remove();
        // для красоты))0
        $('#' + (node instanceof MainPoint ? 'outer' : 'inner') + '-of-' + event.target.id.split('-of-')[1]).hide(300, function() {
            drawing.drawList();
        })
    } else if (~event.target.className.indexOf('plus')) {
        base.undoArr.push(base.parsingToJSON());
        newNodeParent = node.name;
        $('#newModal').modal('show');
    } else if (~event.target.className.indexOf('descriptionText')) {
        let input = document.getElementById('descriptionInput-of-' + event.target.id.split('-of-')[1]);
        input.style.display = 'inline';
        input.style.width = event.target.offsetWidth + 'px';
        input.focus();
        input.oninput = function() {
            input.style.width = input.value.length * 9 + 16;
        }
        input.onblur = function() {
            base.undoArr.push(base.parsingToJSON());
            base.setProperty(node.name, 'description', input.value);
            drawing.drawList();
            event.target.style.width = input.width;
        }
        event.target.style.display = 'none';
    }
};
document.getElementById('save').onclick = function(event, createId = idFunc) {
    let val = document.getElementById('newName').value,
        newNode = new SubPoint(createId(val), newNodeParent, val);
    newNode.overviewDone();
    drawing.drawList();
    document.getElementById('newName').value = newNodeParent = '';
    $('#newModal').modal('hide');
}
document.getElementsByClassName('undo')[0].onclick = function(event) {
    base.undo();
    drawing.drawList();
}
document.getElementsByClassName('redo')[0].onclick = function(event) {
    base.redo();
    drawing.drawList();
}
document.onmousedown = function(e) {
    let elem = e.target.closest('.draggable');
    if (e.which != 1 || !elem) return;
    dragObject.elem = elem.parentNode;
    dragObject.elem = !~dragObject.elem.className.indexOf('SubPoint') ? dragObject.elem.parentNode : dragObject.elem
    // запомнить координаты, с которых начат перенос объекта
    dragObject.downX = e.pageX;
    dragObject.downY = e.pageY;

}
document.onmousemove = function(e) {
    if (!dragObject.elem) return;
    if (!dragObject.avatar) {
        if (Math.abs(e.pageX - dragObject.downX) < 3 && Math.abs(e.pageY - dragObject.downY) < 3) return;
        dragObject.avatar = dragObject.elem.cloneNode(true);
        dragObject.elem.style.opacity = '0.3';
        var coords = getCoords(dragObject.elem);
        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;

    }
    dragObject.avatar.style.zIndex = 9999; // сделать, чтобы элемент был над другими
    dragObject.avatar.style.position = 'absolute';
    dragObject.avatar.style.backgroundColor = 'white';
    dragObject.avatar.style.opacity = '0.5';
    if (dragObject.avatar.parentNode != document.body) {
        document.body.appendChild(dragObject.avatar); // переместить в BODY, если надо
    }
    dragObject.avatar.style.left = e.pageX - dragObject.shiftX * (~dragObject.elem.className.indexOf('SubPoint') ? 1 : 2) + 'px';
    dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';
}
document.onmouseup = function(event) {
    if (!dragObject.elem) return;
    dragObject.avatar.style.zIndex = -99999;
    let dropableElem = document.elementFromPoint(event.clientX, event.clientY).closest('.droppable'),
        draggableElem = document.elementFromPoint(event.clientX, event.clientY).closest('.draggable');
    dragObject.avatar.parentNode.removeChild(dragObject.avatar);
    dragObject.elem.style.opacity = '1';
    if (dropableElem) {
        base.move(dragObject.elem.id.split('-of-')[1], dropableElem.id.split('-of-')[1]);
        drawing.drawList();
    }
    dragObject = {};
}

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}