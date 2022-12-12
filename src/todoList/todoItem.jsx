import React, { useState } from 'react';
import {
    Card,
    Button,
    Typography,
    CardActions,
    CardContent,
    TextField
} from '@mui/material';

const TodoItem = ({ todoItemInfo, handleUpdateTodo, handleChangeCompletState, handleDeleteTodo }) => {

    const [isEditMode, setIsEditMode] = useState(false);
    const [todoItemValue, setTodoItemValue] = useState(todoItemInfo?.todoItem);
    const [style, setStyle] = useState({ display: 'none' });

    const handleSaveTodo = () => {
        setIsEditMode(false);

        if (todoItemValue.trim() === "") {
            return;
        }

        handleUpdateTodo(todoItemInfo.id, todoItemValue);
    };

    const handleCompleteTodo = () => {
        setIsEditMode(false);
        handleChangeCompletState(todoItemInfo.id, !todoItemInfo.completed);
    };

    return (
        <Card
            onMouseEnter={() => {
                setStyle({ display: 'block' });
            }}
            onMouseLeave={e => {
                setStyle({ display: 'none' });
            }}
        >
            <CardContent>
                {
                    isEditMode ? (<TextField id="standard-basic" label="Todo Item Name"
                        variant="standard"
                        value={todoItemValue}
                        onChange={(e) => { setTodoItemValue(e.target.value); }}
                    />) :

                        <Typography
                            variant="h6" gutterBottom
                            style={{
                                textDecoration: todoItemInfo.completed ? "line-through" : "",
                                color: todoItemInfo.completed ? "#2e7d32" : ""
                            }}
                        >
                            {todoItemValue}
                        </Typography>


                }
            </CardContent>
            <CardActions>

                {
                    isEditMode ? <Button size='small' variant='contained' onClick={handleSaveTodo} >
                        Save
                    </Button> : <Button size='small' variant='contained' onClick={() => { setIsEditMode(true); }}>
                        Modify Todo
                    </Button>
                }

                <Button size='small' variant='contained' color={todoItemInfo.completed ? "success" : "error"} onClick={handleCompleteTodo}>
                    {
                        todoItemInfo.completed ? "Undo" : "Done"
                    }
                </Button>
                <Button size='small' variant='contained' color="error" style={style} onClick={() => handleDeleteTodo(todoItemInfo.id)}>
                    Delete Todo
                </Button>
            </CardActions>
        </Card>);
};

export default TodoItem;
