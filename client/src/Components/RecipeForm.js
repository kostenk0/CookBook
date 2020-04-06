import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../index';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap'

class RecipeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            added: false,
            edit: false,
            editedRecipe: null,
            nrIngredientToEdit: -1,

        };

        let fieldProps = props.fields;
        Object.keys(fieldProps).map(el => {
            let val = fieldProps[el];
            if (val.length > 1) this.state[el] = val[1];
            else this.state[el] = "";
            return this.state;
        });

    }

    messages = {
        title_incorrect: 'Назва більше 3 символів',
        description_incorrect: 'Опис довший, ніж 30 символів',
        ingredient_incrorrect: 'Введіть назву',
    }

    changeVal(name, event) {

        // VALIDATION  
        if (name === 'title') {
            if (event.target.value.length < 3) this.setState({ errorstitle: true });
            else this.setState({ errorstitle: false });
        }

        if (name === 'description') {
            if (event.target.value.length < 30) this.setState({ errorsdesc: true });
            else this.setState({ errorsdesc: false });
        }

        if (this.props.type === "add") {
            this.setState({
                [name]: event.target.value
            })
        }
        else if (this.props.type === "edit") {
            let st = Object.assign({}, this.state.editedRecipe);
            let newValue = event.target.value;
            for (let propName in st) {
                if (propName === name) {
                    st[propName] = newValue;
                }
            }
            this.setState({
                editedRecipe: st
            })
        }

    }
    changeIngredientVal(fieldKey, event) {
        let st = Object.assign({}, this.state.editedRecipe);

        var newVal = event.target.value;

        if (fieldKey === 0) {
            st.ingredients[this.state.nrIngredientToEdit].name = newVal;
        }
        else if (fieldKey === 1) {
            st.ingredients[this.state.nrIngredientToEdit].amount = newVal
        }

        if (fieldKey === 'name') {
            let idx;
            let list = this.props.Recipes;
            let exists = false;
            if (list !== null) {
                list.forEach(el => {
                    if (el.id === this.props.selectedId) {
                        idx = list.indexOf(el);
                    }
                })
                this.props.Recipes[idx].ingredients.forEach(el => {
                    if (el.name === newVal) exists = true;

                })
            }

            if (exists === true || newVal.length < 1) this.setState({ errorsIngredientName: true });
            else this.setState({ errorsIngredientName: false });
        }

        if (fieldKey === 0) {
            let idx;
            let list = this.props.Recipes;
            let exists = 0;
            if (list !== null) {
                list.forEach(el => {
                    if (el.id === this.props.selectedId) {
                        idx = list.indexOf(el);
                    }
                })

                this.props.Recipes[idx].ingredients.forEach(el => {
                    if (el.name === newVal) exists++;
                })
            }

            if (exists > 1 || newVal.length < 1) this.setState({ errorsIngredientNameEdit: true });
            else this.setState({ errorsIngredientNameEdit: false });
        }

        this.setState({
            editedRecipe: st
        });

    }
    editIngredient(id, e) {
        this.setState({
            nrIngredientToEdit: id,
        });
    }
    addRecipe() {
        this.setState({
            added: true
        })
        this.props.addRecipe(this.state);
    }


    componentDidMount() {
        if (this.props.type === "edit") {
            let idx;
            let list = this.props.Recipes;
            if (list !== null) {
                list.forEach(el => {
                    if (el.id === this.props.selectedId) {
                        idx = list.indexOf(el);
                    }
                })
                this.setState({
                    editedRecipe: this.props.Recipes[idx],
                    errorsIngredientName: true,
                    errorsIngredientNameEdit: false
                })
            }
        }
        if (this.props.type === "add") {
            this.setState({
                errorstitle: true,
                errorsdesc: true
            })
        }
        else {
            this.setState({
                errorstitle: false,
                errorsdesc: false
            })
        }
    }
    finishEdit(e) {
        this.setState({
            edit: false,
            nrIngredientToEdit: -1
        });
        this.props.RecipeUpdate(this.state.editedRecipe);
    }
    addIngredient() {
        let st = Object.assign({}, this.state.editedRecipe);
        let newIngredient = {
            name: this.myInputName.value,
            amount: this.myInputAmount.value
        };
        st.ingredients.push(newIngredient);

        this.setState({
            editedRecipe: st
        });

        this.myInputName.value = "";
        this.myInputAmount.value = "";
        this.setState({ errorsIngredientName: true });
    }
    onDeleteIngredient() {
        let st = Object.assign({}, this.state.editedRecipe);

        st.ingredients.splice(this.state.nrIngredientToEdit, 1);

        this.setState({
            editedRecipe: st,
            nrIngredientToEdit: -1
        });
    }

    render() {
        if (this.props.type === "add") {
            return this.state.added ? <Redirect to={"/"} /> :
                <div className="col-sm-12 Recipe">
                    <h1 className="addTitle">Новий рецепт</h1>
                    <form className="addForm">
                        {Object.keys(this.props.fields).map(field => {
                            let arr = this.props.fields[field];
                            if (arr.length > 1) {
                                if (field === "description") {
                                    return <p key={field}>
                                        <textarea name="description" placeholder={arr[1]} onChange={this.changeVal.bind(this, field)} />
                                        {this.state.errorsdesc && <span className="validateError">{this.messages.description_incorrect}</span>}
                                    </p>
                                }
                                return <p key={field}>
                                    <input name={field} placeholder={arr[1]} type={arr[0]} onChange={this.changeVal.bind(this, field)} />
                                    {field === 'title' && this.state.errorstitle && <span className="validateError">{this.messages.title_incorrect}</span>}
                                </p>
                            }
                            else return <p key={field}>
                                <input name={field} type={arr[0]} onChange={this.changeVal.bind(this, field)} />
                            </p>
                        })}
                    </form>

                    <p>
                        <Link to="/"><Button variant='primary' size='lg' style={{ marginRight: '10px' }} onClick={this.props.endClickRecipe}>Назад</Button></Link>
                        {this.state.errorsdesc === false && this.state.errorstitle === false && <Link to="/"><Button variant='success' size='lg' style={{ marginRight: '10px' }} onClick={this.addRecipe.bind(this)}>Додати</Button></Link>}
                    </p>
                </div>
        }
        else if (this.props.type === "edit") {
            if (this.state.editedRecipe !== null) {
                return (
                    <div className="col-sm-12 Recipe">
                        <h1 className="addTitle">Редагування рецепту</h1>
                        <form className="addForm" onSubmit={this.props.endClickRecipe}>
                            {Object.keys(this.props.fields).map(field => {
                                let arr = this.props.fields[field];

                                if (arr.length > 1) {
                                    if (field === "description") {
                                        return <p key={field}>
                                            <textarea name="description" placeholder={arr[1]} value={this.state.editedRecipe[field]} onChange={this.changeVal.bind(this, field)} />
                                            {this.state.errorsdesc && <span className="validateError">{this.messages.description_incorrect}</span>}
                                        </p>
                                    }
                                    return <p key={field}>
                                        <input name={field} defaultValue={this.state.editedRecipe[field]} type={arr[0]} onChange={this.changeVal.bind(this, field)} />
                                        {field === 'title' && this.state.errorstitle && <span className="validateError">{this.messages.title_incorrect}</span>}

                                    </p>

                                }
                                else {
                                    if (field === "description") {
                                        return <p key={field}>
                                            <textarea name="description" value={this.state.editedRecipe[field]} onChange={this.changeVal.bind(this, field)} />
                                            {this.state.errorsdesc && <span className="validateError">{this.messages.description_incorrect}</span>}
                                        </p>
                                    }
                                    return <p key={field}>
                                        <input name={field} defaultValue={this.state.editedRecipe[field]} type={arr[0]} onChange={this.changeVal.bind(this, field)} />
                                        {field === 'title' && this.state.errorstitle && <span className="validateError">{this.messages.title_incorrect}</span>}

                                    </p>
                                }

                            })}
                            <div className="col-sm-12 Recipe row">

                                <div className="col-sm-12 col-md-6">
                                    <h1 className="addTitle">Редагування інградієнтів</h1>
                                    <h6 className="helperTitle">Виберіть інградієнт:</h6>
                                    <ul>
                                        {this.state.editedRecipe.ingredients.map((el, index) => {
                                            if (index !== this.state.nrIngredientToEdit) return <li className="list" onClick={this.editIngredient.bind(this, index)} key={el.name + el.amount}>
                                                {el.name + " " + el.amount}
                                            </li>
                                            else return <li key={index}>
                                                <div>
                                                    {Object.values(el).map((field, fieldKey) => {
                                                        return <input type="text" className="searchbox" key={fieldKey} defaultValue={field} onChange={this.changeIngredientVal.bind(this, fieldKey)} />
                                                    }, this)}
                                                    {this.state.errorsIngredientNameEdit && <span className="validateError">{this.messages.ingredient_incrorrect}</span>}
                                                    <div>
                                                        {!this.state.errorsIngredientNameEdit && <Button variant='success' size='lg' style={{ marginRight: '10px' }} onClick={this.finishEdit.bind(this)} type="button">Зберегти</Button>}
                                                        <Button variant='danger' size='lg' style={{ marginRight: '10px' }} onClick={this.onDeleteIngredient.bind(this)}>Видалити</Button>
                                                    </div>
                                                </div></li>
                                        }
                                        )}
                                    </ul>

                                </div>

                                <div className="col-sm-12 col-md-6">
                                    <h1 className="addTitle">Новий інградієнт</h1>
                                    <input className="searchbox" type="text" name="name" ref={input => { this.myInputName = input; }} placeholder="Назва інградієнта" onChange={this.changeIngredientVal.bind(this, "name")} />
                                    {this.state.errorsIngredientName && <span className="validateError">{this.messages.ingredient_incrorrect}</span>}
                                    <input className="searchbox" type="text" name="amount" ref={input => { this.myInputAmount = input; }} placeholder="Кількість" onChange={this.changeIngredientVal.bind(this, "amount")} />
                                    <br />
                                    {!this.state.errorsIngredientName && <Button variant='primary' size='lg' style={{ marginRight: '10px' }} onClick={this.addIngredient.bind(this)} >Додати інградієнт</Button>}
                                </div>
                            </div>
                            <p>
                                {this.state.errorsdesc === false && this.state.errorstitle === false && <Link to="/details"><Button variant='success' size='lg' style={{ marginRight: '10px' }} onClick={this.finishEdit.bind(this)}>Зберегти</Button></Link>}
                            </p>
                        </form>
                    </div>
                );
            }

            return (
                <div className="col-sm-12 Recipe">
                    <p className="nonexist">Упс...<br />Рецепт не знайдено</p>
                    <Link to="/"><Button variant='primary' size='lg' onClick={this.props.endClickRecipe}>Назад</Button></Link>
                </div>
            )
        }

    }
}
RecipeForm.propTypes = {
    type: PropTypes.oneOf(["add", "edit"]),
    fields: PropTypes.object,
    addRecipe: PropTypes.func,
    RecipeUpdate: PropTypes.func,
    selectedId: PropTypes.number,
    endClickRecipe: PropTypes.func
}
export default RecipeForm;