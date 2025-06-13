import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  TrendingUp,
  Eye,
  Download,
  Loader2,
  File
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { analyzeResume } from '@/services/resumeAnalysisService';
import { useAuth } from '@/hooks/useAuth';
import { FileParser } from '@/utils/fileParser';

interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  formatScore: number;
  keywordMatch: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestions: string[];
  sections: {
    name: string;
    score: number;
    feedback: string;
  }[];
}

interface ResumeAnalyzerProps {
  className?: string;
}

const ResumeAnalyzer = ({ className = '' }: ResumeAnalyzerProps) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { user } = useAuth();

  // Real analysis function using the service
  const performAnalysis = useCallback(async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Resume Required',
        description: 'Please upload a file or paste your resume content to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { result } = await analyzeResume({
        resumeText,
        jobDescription: jobDescription || undefined,
        userId: user?.id,
      });
      
      setAnalysisResult(result);
      setActiveTab('results');
      
      toast({
        title: 'Analysis Complete!',
        description: `Your resume scored ${result.overallScore}/100. Check the results tab for detailed feedback.`,
      });
      
    } catch (error) {
      console.error('Resume analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Unable to analyze resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeText, jobDescription, user?.id]);

  // Enhanced file upload handler with multi-format support
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!FileParser.isSupportedFileType(file)) {
      toast({
        title: 'Unsupported File Type',
        description: 'Please upload a PDF, Word document (.doc or .docx), or text file (.txt).',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB max)
    if (!FileParser.validateFileSize(file)) {
      toast({
        title: 'File Too Large',
        description: `File size must be less than 10MB. Your file is ${FileParser.getFileSizeString(file.size)}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingFile(true);
    
    try {
      const extractedText = await FileParser.parseFile(file);
      const cleanedText = FileParser.cleanExtractedText(extractedText);
      
      if (!cleanedText || cleanedText.trim().length < 50) {
        toast({
          title: 'Insufficient Content',
          description: 'The uploaded file does not contain enough readable text. Please check the file and try again.',
          variant: 'destructive',
        });
        return;
      }
      
      setResumeText(cleanedText);
      setUploadedFileName(file.name);
      
      toast({
        title: 'File Uploaded Successfully',
        description: `${FileParser.getFileTypeDescription(file)} content extracted and loaded.`,
      });
      
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to process the uploaded file.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingFile(false);
      // Clear the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  }, []);

  const ScoreCard = ({ title, score, icon: Icon }: { 
    title: string; 
    score: number; 
    icon: React.ComponentType<{ className?: string }> 
  }) => (
    <Card className="text-center">
      <CardContent className="pt-6">
        <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
        <div className="text-2xl font-bold">{score}%</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            AI Resume Analyzer
          </CardTitle>
          <CardDescription>
            Upload your resume (PDF, Word (.doc/.docx), or Text) and get instant feedback with ATS optimization and keyword analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
              <TabsTrigger value="results" disabled={!analysisResult}>
                Results
                {analysisResult && (
                  <Badge variant="secondary" className="ml-2">
                    {analysisResult.overallScore}%
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              {/* File Upload Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Resume</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {isUploadingFile ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Processing file...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <div className="mb-2">
                          <Button 
                            variant="outline" 
                            onClick={() => document.getElementById('file-upload')?.click()}
                            disabled={isUploadingFile}
                          >
                            <File className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            accept=".txt,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-word,text/plain"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Supports PDF, Word (.doc/.docx), and Text (.txt) files
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum file size: 10MB
                        </p>
                      </>
                    )}
                  </div>
                  
                  {uploadedFileName && (
                    <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">Uploaded: {uploadedFileName}</span>
                    </div>
                  )}
                </div>

                {/* Resume Text Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resume Content 
                    <span className="text-muted-foreground ml-1">(extracted from file or paste manually)</span>
                  </label>
                  <Textarea
                    placeholder="Content will appear here when you upload a file, or paste your resume text manually..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {resumeText.length} characters
                  </p>
                </div>

                {/* Job Description Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Description (Optional)
                    <span className="text-sm text-muted-foreground ml-2">
                      - for targeted keyword analysis
                    </span>
                  </label>
                  <Textarea
                    placeholder="Paste the job description to get targeted keyword analysis and recommendations..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                {/* Analyze Button */}
                <Button 
                  onClick={performAnalysis} 
                  disabled={isAnalyzing || isUploadingFile || !resumeText.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {analysisResult && (
                <div className="space-y-6">
                  {/* Overall Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ScoreCard title="Overall Score" score={analysisResult.overallScore} icon={TrendingUp} />
                    <ScoreCard title="ATS Compatible" score={analysisResult.atsScore} icon={CheckCircle} />
                    <ScoreCard title="Content Quality" score={analysisResult.contentScore} icon={FileText} />
                    <ScoreCard title="Format Score" score={analysisResult.formatScore} icon={Eye} />
                  </div>

                  {/* Keyword Match (if job description provided) */}
                  {jobDescription && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Keyword Match Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${analysisResult.keywordMatch}%` }}
                              />
                            </div>
                          </div>
                          <Badge variant={analysisResult.keywordMatch >= 70 ? 'default' : 'destructive'}>
                            {analysisResult.keywordMatch}% Match
                          </Badge>
                        </div>
                        {analysisResult.missingKeywords.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2">Missing Keywords:</p>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.missingKeywords.map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Strengths and Improvements */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          Areas for Improvement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Section-by-Section Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResult.sections.map((section, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{section.name}</span>
                                <Badge variant={section.score >= 80 ? 'default' : section.score >= 60 ? 'secondary' : 'destructive'}>
                                  {section.score}%
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{section.feedback}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button onClick={() => setActiveTab('upload')} variant="outline">
                      Analyze Another Resume
                    </Button>
                    <Button onClick={() => window.print()} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalyzer;
