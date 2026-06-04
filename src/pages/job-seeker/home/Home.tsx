import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Separator } from '../../../components/ui/separator';
import { useFormik } from 'formik';
import {
  FileText,
  Image as ImageIcon,
  Info,
  UserPlus,
  Video,
  X,
  Briefcase
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { createPost, fetchFeed, uploadImage } from '../../../api/postApi';
import { fetchJobs } from '../../../api/jobApi';
import PostCard from '../../../components/shared/PostCard';
import type { AppDispatch, RootState } from '../../../store';
import { getToken } from '../../../utils/token';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: posts } = useSelector((state: RootState) => state.posts);
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const user = useMemo(() => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('token payload:', payload);
      return {
        id: payload.sub,
        name: payload.fullName || payload.name || "User",
        email: payload.email,
        initial: (payload.fullName || payload.name || payload.email || "U").charAt(0).toUpperCase()
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  useEffect(() => {
    dispatch(fetchFeed());
    dispatch(fetchJobs());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { content: '' },
    validationSchema: Yup.object({
      content: Yup.string().trim().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      let imageUrl = null;
      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (e) {
          console.error('Image upload failed:', e);
        }
        setUploading(false);
      }
      await dispatch(createPost({ content: values.content, imageUrl }));
      resetForm();
      setImageFile(null);
      setImagePreview(null);
    },
  });

  return (
    <section className='bg-background transition-colors duration-300'>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8  min-h-screen">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="h-16 bg-linear-to-r from-blue-400 to-cyan-300" />
              <div className="px-4 pb-4 -mt-8 flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-white ring-2 ring-white">
                  <AvatarFallback className="text-xl font-bold bg-muted">{user?.initial}</AvatarFallback>
                </Avatar>
                <h2 className="mt-2 text-lg font-bold text-center">{user?.name}</h2>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">Senior Full-Stack Developer | AI & Cloud Architecture</p>
              </div>
              <Separator />
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between hover:bg-muted/50 p-1 cursor-pointer">
                  <span className="text-muted-foreground font-semibold">Profile views</span>
                  <span className="text-blue-600 font-bold">1,248</span>
                </div>
                <div className="flex justify-between hover:bg-muted/50 p-1 cursor-pointer">
                  <span className="text-muted-foreground font-semibold">Post impressions</span>
                  <span className="text-blue-600 font-bold">5,320</span>
                </div>
              </div>
              <Separator />
              <div className="p-4 text-xs font-semibold hover:bg-muted/50 cursor-pointer flex items-center gap-2 text-muted-foreground">
                <span>My items</span>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4">
                <form onSubmit={formik.handleSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{user?.initial}</AvatarFallback>
                    </Avatar>
                    <Input
                      name="content"
                      placeholder="Start a post with AI assistance..."
                      className="rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-blue-600 h-12 text-sm flex-1"
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  {imagePreview && (
                    <div className="relative rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="preview" className="w-full max-h-64 object-cover" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full h-7 w-7"
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={imageInputRef}
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground gap-2"
                        onClick={() => imageInputRef.current?.click()}>
                        <ImageIcon className="text-blue-500" size={20} /> Photo
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground gap-2">
                        <Video className="text-green-500" size={20} /> Video
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground gap-2">
                        <FileText className="text-orange-500" size={20} /> Write article
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 rounded-full px-5"
                      disabled={formik.isSubmitting || uploading || !formik.values.content.trim()}
                    >
                      {uploading ? 'Uploading...' : formik.isSubmitting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                currentUserInitial={user?.initial}
              />
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="p-4 flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-bold">AI Job Matches</h3>
                <Info size={14} className="text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {jobs.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No matches found yet.</p>
                ) : (
                  jobs.slice(0, 3).map((job) => (
                    <div key={job.id} className="flex gap-2 items-start group cursor-pointer" onClick={() => navigate('/job')}>
                      <div className="h-8 w-8 bg-slate-800 rounded flex items-center justify-center text-[8px] text-white font-bold">
                        <Briefcase size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold group-hover:text-blue-600 group-hover:underline">{job.title}</p>
                        <p className="text-[10px] text-muted-foreground">{job.companyName || 'Company'}</p>
                        <p className="text-[10px] text-blue-600 font-semibold mt-1 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                          {job.aiMatchScore || 85}% Match
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <Link to="/jobs">
                <Button variant="outline" className="w-full text-blue-600 border-blue-600 rounded-full h-8 text-xs font-bold hover:bg-blue-50" >View all matches</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm p-4">
              <h3 className="text-sm font-bold mb-4">People you may know</h3>
              <div className="space-y-4">
                {[
                  { name: 'Alex Morgan', title: 'Product at Linear' },
                  { name: 'Lisa Wong', title: 'Principal Engineer' }
                ].map((person, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-bold">{person.name}</p>
                        <p className="text-[10px] text-muted-foreground">{person.title}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-muted-foreground/30"><UserPlus size={16} /></Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-none shadow-sm p-4">
              <h3 className="text-sm font-bold mb-4">Trending in Tech</h3>
              <div className="space-y-4">
                {[
                  { tag: '#Web3Sustainability', posts: '1,240 posts' },
                  { tag: '#AIAssistedCoding', posts: '8,520 posts' },
                  { tag: '#RemoteWorkEvolution', posts: '4,110 posts' }
                ].map((trend, idx) => (
                  <div key={idx} className="cursor-pointer group">
                    <p className="text-xs font-bold group-hover:text-blue-600 group-hover:underline">{trend.tag}</p>
                    <p className="text-[10px] text-muted-foreground">{trend.posts}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Home;