import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from "moment";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    //This was already here
    it('1 == 1', function () {
        expect(true).toBe(true)
    });

    //Test that exactly as many posts are rendered as contained in testData variable
    it('has as many posts as contained in testData', () => {
        const posts = wrapper.findAll('.post');
        expect(posts.length).toEqual(testData.length);
    });

    //Test that post create time is displayed in correct format: Saturday, December 5, 2020 1:53 PM
    it('post create time is displayed in correct format', () => {
        for (let i = 0; i < wrapper.length; i++) {
            const actualDate = wrapper[i].createTime;
            const expectedDate = moment(actualDate).format('LLLL');
            expect(actualDate).toEqual(expectedDate);
        }
    });

    // Test that if post has media property, image or video tags are rendered depending on media.type property,
    // and if media property is absent nothing is rendered.
    it('tags are rendered only if post has media property', () => {

        //const imageTags = testData.filter(item.media.type => item.media.type.image)
        const imageTags = testData.filter(item => (item.media !== null && item.media.type === 'image'))
        const actualImageTags = wrapper.findAll('.post .post-image img');
        expect(imageTags.length).toEqual(actualImageTags.length);

        //const videoTags = testData.filter(item.media.type => item.media.type.video)
        const videoTags = testData.filter(item => (item.media !== null && item.media.type === 'video'))
        const actualVideoTags = wrapper.findAll('.post .post-image video');
        expect(videoTags.length).toEqual(actualVideoTags.length);

    });
});