import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap'



const RecipeDetails = (props) => {
    if (props.selectedId > 0) {
        return (
            props.Recipes.map(Recipe => {
                if (Recipe.id === props.selectedId) {
                    return (
                        <Card className="text-center" >
                            <Card.Header>{Recipe.id}</Card.Header>
                            <Card.Body>
                                <Card.Title>{Recipe.title}</Card.Title>
                                <Card.Text>
                                {Recipe.ingredients.map((el, index) => {
                                        return <li className="list" key={el.name + el.amount}>
                                            {el.name + " " + el.amount}
                                        </li>
                                    })}
                                </Card.Text>
                                <Card.Text>
                                    {Recipe.description}
                                </Card.Text>
                                <Link to="/"><Button variant="primary" style={{ marginRight: '10rem' }} onClick={props.endClickRecipe}>Назад</Button></Link>
                                <Link to="/edit"><Button variant="info">Редагувати</Button></Link>
                                <Link to="/"><Button variant="danger" style={{ marginLeft: '10rem' }} onClick={() => props.deleteRecipe(props.selectedId)}>Видалити</Button></Link>
                            </Card.Body>
                            <Card.Footer className="text-muted">сьогодні</Card.Footer>
                        </Card>
                    );
                }
                else return false;
            })
        );
    }

    return (
        <div className="col-sm-12 Recipe">
            <p>Рецепт відсутній</p>
            <Link to="/"><Button variant="primary" onClick={props.endClickRecipe}>Назад</Button></Link>
        </div>
    )
}

RecipeDetails.propTypes = {
    Recipes: PropTypes.arrayOf(PropTypes.object),
    selectedId: PropTypes.number,
    endClickRecipe: PropTypes.func,
    deleteRecipe: PropTypes.func
}
export default RecipeDetails;