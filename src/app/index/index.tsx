import {
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Text,
  Alert,
  Linking
} from "react-native";
import { styles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Categories } from "@/components/categories";
import { Link } from "@/components/link";
import { Option } from "@/components/option";
import { router, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { categories } from "@/utils/categories";
import { linkStorage, LinkStorage } from "@/storage/link-storage";

export default function Index() {
 const [category, setCategory] = useState(categories.at(0)?.name) 
 const [showModal, setShowModal] = useState(false)
 const [links, setLinks] = useState<LinkStorage[]>([])
 const [link, setLink] = useState<LinkStorage>({} as LinkStorage)

  const getLinks = async () => {
    try {
      const response = await linkStorage.get()
      const filtered = response.filter((link) => link.category === category)
      setLinks(filtered)      
    } catch (error) {
      Alert.alert("erro", "Não foi possivel listar os links")
    }
  }

  const handleDetails = (selected: LinkStorage) => {
    setLink(selected)
    setShowModal(true)
  }

  const handleOpen = async () => {
    try {
      await Linking.openURL(link.url)
      setShowModal(false)
    } catch (error) {
      console.log(error)
      Alert.alert("Link", "Não foi possivel abrir o link")
    }
  }

  const handleRemove = async () => {
    try {
        Alert.alert("Excluir", "Deseja realmente excluir?", [
          {style: "cancel", text: "Não"},
          {text: "Sim", onPress: async () => {
            await linkStorage.remove(link.id)
            getLinks()
            setShowModal(false)
          }}
        ])
    } catch (error) {
       Alert.alert("Erro", "Nao foi possivel excluir") 
    }
  }


  useFocusEffect(useCallback(() => {
    getLinks()
  }, [category]))

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/app/assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => router.navigate("../add")}>
          <MaterialIcons name="add" size={32} color={colors.green[300]} />
        </TouchableOpacity>
      </View>
      <Categories onChange={setCategory} selected={category ?? ""}/>

      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <Link
            name={item.name}
            url={item.url}
            onDetails={() => handleDetails(item)}
          />
        )}
        style={styles.links}
        contentContainerStyle={styles.linksContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategory}>Curso</Text>

              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLinkName}>{link.name}</Text>

            <Text style={styles.modalUrl}>{link.url}</Text>

            <View style={styles.modalFooter}>
              <Option name="Excluir" icon="delete" variant="secondary" onPress={handleRemove}/>
              <Option name="Abrir" icon="language" onPress={handleOpen}/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
