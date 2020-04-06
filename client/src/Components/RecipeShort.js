import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap'

const RecipeShort = (props) => {
    if (props.Recipes !== null) {
        return (
            props.Recipes.map(Recipe => {
                return (

                    <Card border="info" style={{ margin: '20px' }}>
                        <Card.Body>
                            <Card.Title>{Recipe.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                {Recipe.ingredients.map((el, index) => {
                                    return <li key={el.name + el.amount}>
                                        {el.name + " " + el.amount}
                                    </li>
                                })}
                            </Card.Subtitle>
                            <Card.Text>
                                {Recipe.description.slice(0, 100)}...
                      </Card.Text>
                            <Link to="/details"><Button variant="light" onClick={() => props.clickRecipe(Recipe.id)}>Детальніше</Button></Link>
                        </Card.Body>
                    </Card>
                );
            })
        );
    }

    return (
        <p>Відсутні рецепти</p>
    )
}

export default RecipeShort;