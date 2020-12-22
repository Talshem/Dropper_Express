import styled from 'styled-components'

export const PagingButton = styled.button`
cursor: pointer;
margin:3px;
font-size:16px;
min-width:40px;
border:none;
border-radius:3px;
background: ${(props) => (props.focus ? "#e0e0e0" : "white")};
&:active{
outline: none;
background:#b0b0b0;
}
&:focus{
outline:none;
}
`