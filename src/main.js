import { createApp } from 'vue';
import './style.css';
import './primeicons/primeicons.css';
// import 'primeicons/primeicons.css'
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';


import Accordion from 'primevue/accordion';
import AccordionContent from 'primevue/accordioncontent';
import AccordionHeader from 'primevue/accordionheader';
import AccordionPanel from 'primevue/accordionpanel';
import AutoComplete from 'primevue/autocomplete';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import Badge from 'primevue/badge';
import BlockUI from 'primevue/blockui';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import CascadeSelect from 'primevue/cascadeselect';
import Chart from 'primevue/chart';
import Checkbox from 'primevue/checkbox';
import CheckboxGroup from 'primevue/checkboxgroup';
import Chip from 'primevue/chip';
import ColorPicker from 'primevue/colorpicker';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import ContextMenu from 'primevue/contextmenu';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import DatePicker from 'primevue/datepicker';
import DeferredContent from 'primevue/deferredcontent';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dock from 'primevue/dock';
import Drawer from 'primevue/drawer';
import DynamicDialog from 'primevue/dynamicdialog';
import Editor from 'primevue/editor';
import Fieldset from 'primevue/fieldset';
import FileUpload from 'primevue/fileupload';
import FloatLabel from 'primevue/floatlabel';
import Fluid from 'primevue/fluid';
import Galleria from 'primevue/galleria';
import IconField from 'primevue/iconfield';
import IftaLabel from 'primevue/iftalabel';
import Image from 'primevue/image';
import ImageCompare from 'primevue/imagecompare';
import Inplace from 'primevue/inplace';
import InputChips from 'primevue/inputchips';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputIcon from 'primevue/inputicon';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputOtp from 'primevue/inputotp';
import InputText from 'primevue/inputtext';
import Knob from 'primevue/knob';
import Listbox from 'primevue/listbox';
import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';
import MeterGroup from 'primevue/metergroup';
import MultiSelect from 'primevue/multiselect';
import OrderList from 'primevue/orderlist';
import OrganizationChart from 'primevue/organizationchart';
import OverlayBadge from 'primevue/overlaybadge';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import PanelMenu from 'primevue/panelmenu';
import Password from 'primevue/password';
import PickList from 'primevue/picklist';
import Popover from 'primevue/popover';
import Portal from 'primevue/portal';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';
import Rating from 'primevue/rating';
import Row from 'primevue/row';
import ScrollPanel from 'primevue/scrollpanel';
import ScrollTop from 'primevue/scrolltop';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import Skeleton from 'primevue/skeleton';
import Slider from 'primevue/slider';
import SpeedDial from 'primevue/speeddial';
import SplitButton from 'primevue/splitbutton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Step from 'primevue/step';
import StepItem from 'primevue/stepitem';
import StepList from 'primevue/steplist';
import StepPanel from 'primevue/steppanel';
import StepPanels from 'primevue/steppanels';
import Stepper from 'primevue/stepper';
import Steps from 'primevue/steps';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabMenu from 'primevue/tabmenu';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import Tag from 'primevue/tag';
import Terminal from 'primevue/terminal';
import Textarea from 'primevue/textarea';
import TieredMenu from 'primevue/tieredmenu';
import Timeline from 'primevue/timeline';
import Toast from 'primevue/toast';
import ToggleButton from 'primevue/togglebutton';
import ToggleSwitch from 'primevue/toggleswitch';
import Toolbar from 'primevue/toolbar';
import Tree from 'primevue/tree';
import TreeSelect from 'primevue/treeselect';
import TreeTable from 'primevue/treetable';
import VirtualScroller from 'primevue/virtualscroller';
import Tooltip from 'primevue/tooltip';
import Ripple from 'primevue/ripple';
import router from './router'; // Importando as rotas
import Aura from '@primevue/themes/aura';
// import Aura from '@primeuix/themes/aura';
import StyleClass from 'primevue/styleclass'


const app = createApp(App);



app.component('Accordion', Accordion);
app.component('AccordionContent', AccordionContent);
app.component('AccordionHeader', AccordionHeader);
app.component('AccordionPanel', AccordionPanel);
app.component('AutoComplete', AutoComplete);
app.component('Avatar', Avatar);
app.component('AvatarGroup', AvatarGroup);
app.component('Badge', Badge);
app.component('BlockUI', BlockUI);
app.component('Breadcrumb', Breadcrumb);
app.component('Button', Button);
app.component('ButtonGroup', ButtonGroup);
app.component('Card', Card);
app.component('Carousel', Carousel);
app.component('CascadeSelect', CascadeSelect);
app.component('Chart', Chart);
app.component('Checkbox', Checkbox);
app.component('CheckboxGroup', CheckboxGroup);
app.component('Chip', Chip);
app.component('ColorPicker', ColorPicker);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('ConfirmDialog', ConfirmDialog);
app.component('ConfirmPopup', ConfirmPopup);
app.component('ContextMenu', ContextMenu);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('DatePicker', DatePicker);
app.component('DeferredContent', DeferredContent);
app.component('Dialog', Dialog);
app.component('Divider', Divider);
app.component('Dock', Dock);
app.component('Drawer', Drawer);
app.component('DynamicDialog', DynamicDialog);
app.component('Editor', Editor);
app.component('Fieldset', Fieldset);
app.component('FileUpload', FileUpload);
app.component('FloatLabel', FloatLabel);
app.component('Fluid', Fluid);
app.component('Galleria', Galleria);
app.component('IconField', IconField);
app.component('IftaLabel', IftaLabel);
app.component('Image', Image);
app.component('ImageCompare', ImageCompare);
app.component('Inplace', Inplace);
app.component('InputChips', InputChips);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('InputIcon', InputIcon);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('InputOtp', InputOtp);
app.component('InputText', InputText);
app.component('Knob', Knob);
app.component('Listbox', Listbox);
app.component('MegaMenu', MegaMenu);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('MeterGroup', MeterGroup);
app.component('MultiSelect', MultiSelect);
app.component('OrderList', OrderList);
app.component('OrganizationChart', OrganizationChart);
app.component('OverlayBadge', OverlayBadge);
app.component('Paginator', Paginator);
app.component('Panel', Panel);
app.component('PanelMenu', PanelMenu);
app.component('Password', Password);
app.component('PickList', PickList);
app.component('Popover', Popover);
app.component('Portal', Portal);
app.component('ProgressBar', ProgressBar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('RadioButton', RadioButton);
app.component('RadioButtonGroup', RadioButtonGroup);
app.component('Rating', Rating);
app.component('Row', Row);
app.component('ScrollPanel', ScrollPanel);
app.component('ScrollTop', ScrollTop);
app.component('Select', Select);
app.component('SelectButton', SelectButton);
app.component('Skeleton', Skeleton);
app.component('Slider', Slider);
app.component('SpeedDial', SpeedDial);
app.component('SplitButton', SplitButton);
app.component('Splitter', Splitter);
app.component('SplitterPanel', SplitterPanel);
app.component('Step', Step);
app.component('StepItem', StepItem);
app.component('StepList', StepList);
app.component('StepPanel', StepPanel);
app.component('StepPanels', StepPanels);
app.component('Stepper', Stepper);
app.component('Steps', Steps);
app.component('Tab', Tab);
app.component('TabList', TabList);
app.component('TabMenu', TabMenu);
app.component('TabPanel', TabPanel);
app.component('TabPanels', TabPanels);
app.component('Tabs', Tabs);
app.component('Tag', Tag);
app.component('Terminal', Terminal);
app.component('Textarea', Textarea);
app.component('TieredMenu', TieredMenu);
app.component('Timeline', Timeline);
app.component('Toast', Toast);
app.component('ToggleButton', ToggleButton);
app.component('ToggleSwitch', ToggleSwitch);
app.component('Toolbar', Toolbar);
app.component('Tree', Tree);
app.component('TreeSelect', TreeSelect);
app.component('TreeTable', TreeTable);
app.component('VirtualScroller', VirtualScroller);


app.use(PrimeVue, {
    theme: {
        ripple: true,
        preset: Aura,
        options: {
            darkModeSelector: false || 'none',
        }
    }
 });

app.use(ToastService);
app.use(ConfirmationService);

app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);
app.directive('styleclass', StyleClass)

// const base_url = 'http://localhost:80';

// const base_url_ofertas = 'http://localhost:81';

const base_devolucoes = 'https://basetekmaquinas.squareweb.app';
const base_url_ofertas = 'https://apitekmaquinasstock.squareweb.app';
const base_url = 'https://apitekmaquinas.squareweb.app';


app.provide('base_url', base_url)
app.provide('base_url_ofertas', base_url_ofertas)
app.provide('base_url_devolucoes', base_devolucoes)

// Registrando o Vue Router
app.use(router);

// Montando a aplicação

app.mount('#app');
