/* eslint-disable prettier/prettier */
import { TouchableOpacity, Text } from 'react-native';
import React from 'react';

const BorderLessBtn = ({ text, onPress, containerStyle = {}, textStyle = { color: 'red' }, disabled = false }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={containerStyle} disabled={disabled}>
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
};

export default BorderLessBtn;
