import Vue from 'vue'
/*confirm组件*/
import Confirm from 'components/confirm'
/*loading组件*/
import Loading from 'components/loading'
/*日历组件*/
import Calendar from 'components/calendar';

const ConfirmConstructor = Vue.extend(Confirm);
const LoadingConstructor = Vue.extend(Loading);
const CalendarConstructor = Vue.extend(Calendar);


export function ConfirmComponent({title, message, buttons, onConfirm, onCancel}) {
    let instance = new ConfirmConstructor({
        el: document.createElement('div')
    });
    title !== undefined && (instance.title = title);
    message !== undefined && (instance.content = message);
    (buttons !==undefined && Array.isArray(buttons)) && (instance.buttons = buttons);

    document.body.appendChild(instance.$el);
    Vue.nextTick(() => {
        instance.canConfirm = true
    });
    return instance;
}
export function LoadingComponent() {
    let loading = new LoadingConstructor({
        name: 'loading',
        el: document.createElement('div')
    });
    document.body.appendChild(loading.$el);
    Vue.nextTick(() => {
        loading.showLoad = true
    });
    return loading;
}
export function CalendarComponent({year, month, day, choseDay, changeMonth, isToday, markDate, markDateMore, agoDayHide, futureDayHide}) {
    let calc1=new CalendarConstructor({
        el: document.createElement('div')
    });
    /*跳转到指定的日期*/
    calc1.ChoseMonth(year + '-' + month + '-' + day);
    /*隐藏组件*/
    calc1.showComponent = function () {
        calc1.$el.style.display = 'block';
    };
    /*隐藏组件*/
    calc1.hideComponent = function () {
        calc1.$el.style.display = 'none';
    };
    /*监听choseDay*/
    calc1.$on('choseDay',function (data) {
        let dateArr = data.split('-');
        let dateObj = {
            year: dateArr[0],
            month: dateArr[1],
            day: dateArr[2]
        };
        typeof choseDay === 'function' && choseDay(dateObj);
        calc1.hideComponent();
    });
    /*监听changeMonth*/
    calc1.$on('changeMonth',function (data) {
        typeof changeMonth === 'function' && changeMonth(data);
    });
    /*监听isToday*/
    calc1.$on('isToday',function (data) {
        typeof isToday === 'function' && isToday(data);
    });
    calc1.markDate = Array.isArray(markDate) ? markDate : [];
    calc1.markDateMore = Array.isArray(markDateMore) ? markDateMore : [];
    calc1.agoDayHide = (typeof agoDayHide === 'string' && agoDayHide.length === 10) ? agoDayHide : 0;
    calc1.futureDayHide = (typeof futureDayHide === 'string' && futureDayHide.length === 10) ? futureDayHide : '9999999999';
    document.body.appendChild(calc1.$el);
    return calc1
}
