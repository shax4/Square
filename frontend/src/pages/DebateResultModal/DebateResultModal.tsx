import {View, Button, Text, Modal} from 'react-native';

const DebateResultModal = () => {
    return (
        <Modal>
            <View style={{flex: 1, backgroundColor: "lightblue", padding: 60}}>
                <Text>Modal Content</Text>
                <Button title="Close" color="midnightblue"/>
            </View>
        </Modal>
    );
}

export default DebateResultModal;