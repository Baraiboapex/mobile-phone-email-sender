<template>
    <div class="p-2">
        <div class="row p-0">
            <div class="col-12 p-0">
                <div class="field-group">
                    <h4>{{ listLabel }}</h4>
                </div>
            </div>
        </div>
        <div class="row p-0 mb-2">
            <div class="col-12 p-0">
                <label>Selected Items</label>
                <div class="selcted-item-container app-component-border d-flex flex-row justify-content-start align-items-center flex-wrap">
                    <div v-for="item in state.selectedItems" class="app-button-small p-1 m-1 d-flex flex-row">
                        <button class="p-0 close-button btn btn-danger p-1" @click="(event)=>removedItemFromList(event, item)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </button>
                        <span class="m-2">{{ item[searchableField] }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row p-0">
            <div class="col-12 p-0">
                <div class="field-group mt-2 mb-2">
                    <label for="subject">Search List Items</label>
                    <input type="text" :disabled="showLoading" name="subject" class="w-100 m-1 text-input" @keyup="((event)=>searchItems(event))"/>
                </div>
            </div>
        </div>
        <div class="row p-0 app-component-border">
            <div class="col-12">
                <div class="list-container overflow-scroll d-flex w-100 flex-column flex-wrap justify-content-start align-items-start">
                    
                    <div v-if="hasData" class="w-100">
                        <div v-for="item in state.actualListItems" :class="(item.itemSelected ? 'app-button-small-selected ' : '' ) + 'app-button-small text-overflow-elipses p-3 m-1 w-100'" @click="(event)=>addItemToList(event, item)" >
                            {{ item[searchableField] }}
                            {{ item.itemSelected }}
                        </div>
                    </div>
                    <div v-else class="d-flex justify-content-center mb-4 w-100">
                        <LoadingSign
                            :showLoadingSign="showLoading"
                            :loadingMessageText="dataLoadingMessage"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { reactive, computed, watch, onMounted} from "vue";

    import LoadingSign from "./LoadingSign.vue";

    const state = reactive({
        actualListItems:[],
        selectedItems:[],
        selectedIndices:[]
    });

    const emittedEvents = defineEmits([
        "listItemsUpdated"
    ]);
    
    const props = defineProps({
        listItems:Object,
        searchableField:String,
        selectableField:String,
        listLabel:String,
        dataLoadingMessage:String
    });
    
    const currentData = computed(()=>props.listItems ? props.listItems : []);
    const hasData = computed(()=> props.listItems !== null && props.listItems.length > 0 && props.listItems !== undefined);
    const showLoading = computed(()=>props.listItems.length < 1);

    onMounted(()=>{
        getData();
    });

    watch(currentData, ()=>{
        getData();
    });

    const getData=()=>{
        const formattedListItems = formatListDataFromProps();
        state.actualListItems = formattedListItems;
    };

    const formatListDataFromProps = () => {
        const formattedListItems = props.listItems.map((listItem, index)=>(
            {
                itemSelected:false,
                index,
                ...listItem,
            }
        ));
        return formattedListItems;
    }

    const determnineIfItemsOnListAreSelected = () => {
        const listItems = formatListDataFromProps();
        
        let listHasSelectedItems = state.selectedIndices.length > 0;

        if(listHasSelectedItems){
            const listItemsWithSelectedItems = listItems.map((item)=>{
                if(state.selectedIndices.includes(item.index)){
                    item.itemSelected = true;
                    return item
                }
                return item;
            });
            return listItemsWithSelectedItems;
        }else{
            return listItems;
        }
    }

    const determineActualListItemsViewed = (searchText) => {
        let returnedFormattedData = determnineIfItemsOnListAreSelected();
        return searchText === "" ? returnedFormattedData : state.actualListItems.filter((item)=>item[props.searchableField].includes(searchText));
    };

    const searchItems = (event) => {
        let searchText = event.target.value;
        let viewedListItems = determineActualListItemsViewed(searchText);

        state.actualListItems = viewedListItems;
    };

    const addItemToList = (_,item, index) => {
        const alreadyHasItem = state.selectedItems.find((btnItem)=> btnItem[props.searchableField] === item[props.searchableField]);
        
        if(!alreadyHasItem){
            item.itemSelected = true;

            state.selectedItems.push(item);
            state.selectedIndices.push(item.index);

            emittedEvents("listItemsUpdated", state.selectedItems);
        }else{
            return;
        }
    };

    const removedItemFromList = (_,item) => {

        state.actualListItems[item.index].itemSelected = false;

        state.selectedItems = state.selectedItems.filter(btnItem=>{
            return btnItem[props.selectableField] !== item[props.selectableField];
        });
        state.selectedIndices = state.selectedIndices.filter(btnIndex=>{
            return btnIndex !== item.index;
        });

        console.log("TEST-1", state.selectedItems);
        console.log("TEST-2", state.selectedIndices);
        console.log(item);
        emittedEvents("listItemsUpdated", state.selectedItems);
    };

    
</script>